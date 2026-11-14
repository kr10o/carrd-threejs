#!/usr/bin/env python3
"""
convert_blend_to_glb.py
Loads tshirt.blend headlessly (via PyPI `bpy` in .venv or Portable Blender),
removes any metal hanger/stage objects, repairs back-panel split normal fractures,
and exports a gentle 16-bit Position / 12-bit Normal Draco-compressed tshirt.glb.
"""

import os
import re
import sys
import bpy


def parse_cli_args():
    """Supports both `python convert_blend_to_glb.py in.blend out.glb`
    and `blender.exe -b --python convert_blend_to_glb.py -- in.blend out.glb`."""
    argv = sys.argv
    if "--" in argv:
        custom_args = argv[argv.index("--") + 1:]
    else:
        custom_args = argv[1:]

    input_blend = custom_args[0] if len(custom_args) >= 1 else "tshirt.blend"
    output_glb = custom_args[1] if len(custom_args) >= 2 else "tshirt.glb"
    return os.path.abspath(input_blend), os.path.abspath(output_glb)


def convert_blend_to_draco_glb(input_blend_path: str, output_glb_path: str):
    if not os.path.isfile(input_blend_path):
        raise FileNotFoundError(f"Source blend file not found: {input_blend_path}")

    print(f"[1/4] Loading Blend file: {input_blend_path}")
    bpy.ops.wm.open_mainfile(filepath=input_blend_path)

    if bpy.context.object and bpy.context.object.mode != "OBJECT":
        bpy.ops.object.mode_set(mode="OBJECT")

    # 1. Strip non-garment objects (metal hangers, hooks, rods, cameras, lights, walls)
    strip_regex = re.compile(
        r"hanger|hook|rod|wire|clip|stand|camera|light|sun|spot|plane|floor|wall|empty",
        re.IGNORECASE,
    )

    removed_names = []
    for obj in list(bpy.data.objects):
        if obj.type != "MESH" or strip_regex.search(obj.name):
            removed_names.append(obj.name)
            bpy.data.objects.remove(obj, do_unlink=True)

    print(f"[2/4] Stripped non-garment objects: {removed_names}")

    # 2. Repair normals & apply transforms on all remaining T-shirt meshes
    garment_meshes = [obj for obj in bpy.data.objects if obj.type == "MESH"]
    if not garment_meshes:
        raise RuntimeError("No garment MESH objects remained in tshirt.blend after filtering!")

    bpy.ops.object.select_all(action="DESELECT")

    for obj in garment_meshes:
        obj.hide_set(False)
        obj.hide_viewport = False
        obj.select_set(True)
        bpy.context.view_layer.objects.active = obj

        # Apply any unapplied modifiers (Subdivision, Cloth, etc.)
        for mod in list(obj.modifiers):
            try:
                bpy.ops.object.modifier_apply(modifier=mod.name)
            except Exception as mod_err:
                print(f"  [Info] Skipped modifier '{mod.name}' on '{obj.name}': {mod_err}")

        # Apply Location, Rotation, and Scale so normals are never sheared
        bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

        # Enter Edit Mode to clear locked Custom Split Normals (root cause of back fractures)
        bpy.ops.object.mode_set(mode="EDIT")
        bpy.ops.mesh.select_all(action="SELECT")

        try:
            bpy.ops.mesh.customdata_custom_splitnormals_clear()
        except Exception:
            pass

        # Recalculate consistent outside normals without welding UV seams
        bpy.ops.mesh.normals_make_consistent(inside=False)
        bpy.ops.object.mode_set(mode="OBJECT")

        # Enable smooth polygon shading across the garment
        bpy.ops.object.shade_smooth()

    # Re-select all cleaned garment meshes for export
    for obj in garment_meshes:
        obj.select_set(True)

    print(f"[3/4] Repaired split normals on {len(garment_meshes)} garment mesh(es).")

    # 3. Export to GLB with gentle 16-bit Position / 12-bit Normal Draco quantization
    print(f"[4/4] Exporting Draco-compressed GLB -> {output_glb_path}")
    export_kwargs = dict(
        filepath=output_glb_path,
        export_format="GLB",
        use_selection=True,
        export_apply=True,
        export_yup=True,
        export_texcoords=True,
        export_normals=True,
        export_tangents=False,
        export_materials="EXPORT",
        export_draco_mesh_compression_enable=True,
        export_draco_mesh_compression_level=6,
        export_draco_position_quantization=16,
        export_draco_normal_quantization=12,
        export_draco_texcoord_quantization=14,
        export_draco_generic_quantization=12,
    )

    # Filter kwargs against the active bpy glTF exporter version for forward/backward safety
    rna_props = bpy.ops.export_scene.gltf.get_rna_type().properties.keys()
    safe_kwargs = {k: v for k, v in export_kwargs.items() if k in rna_props}

    bpy.ops.export_scene.gltf(**safe_kwargs)

    size_mb = os.path.getsize(output_glb_path) / (1024 * 1024)
    print(f"[SUCCESS] Generated '{os.path.basename(output_glb_path)}' ({size_mb:.2f} MB)")


if __name__ == "__main__":
    in_blend, out_glb = parse_cli_args()
    convert_blend_to_draco_glb(in_blend, out_glb)
