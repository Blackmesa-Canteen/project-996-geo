def proximity(input_path, aoi_path, ideal_value):
    layer_name = os.path.basename(input_path).split(".")[0]
    print(layer_name)
    extent_layer = QgsVectorLayer(aoi_path, "AOI", "ogr")
    extent = extent_layer.extent()
    # --- convert input vector layer to raster ---
    print("Rasterising input layer")
    feature_ras_path = f"{base_dir}\\data\\tif\\{layer_name}_proximity.tif"
    processing.run("gdal:rasterize",
                   {'INPUT': suitability["input_path"],
                    'BURN': 1, 'UNITS': 1, 'WIDTH': 50, 'HEIGHT': 50,
                    'EXTENT': extent, 'NODATA': 0,
                    'OPTIONS': '', 'DATA_TYPE': 5, 'INIT': None, 'INVERT': False, 'EXTRA': '',
                    'OUTPUT': feature_ras_path})
    # --- Run Raster Proximity tool ---

    # --- Sample Proximity Raster Values to Property Points ---

    # return sample_layer

def raster_value(input_path, aoi_path, ideal_value):
    pass
    # --- Sample input raster to points ---
    # return sample_layer
