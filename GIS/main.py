import os
import datetime
from suitability_functions import *
# _________________________________________ ENVIRONMENT SETUP ______________________________________
base_dir = r"C:\svproject\GovHack2024"
output_dir = f"{base_dir}\\outputs"
scratch_dir = f"{base_dir}\\data\\gpkg\\scratch"
default_crs = QgsCoordinateReferenceSystem('EPSG:7844')
# _________________________________________ DECLARE INPUTS _________________________________________
AOI_layer_path = f"{base_dir}\\data\\gpkg\\AOI_Bendigo_SA4.gpkg"
property_layer_path = f"{base_dir}\\data\\gpkg\\Property.gpkg"
output_path = f"{base_dir}\\outputs\\Property_Suitability.gpkg"

exclusion_path_list = [f"{base_dir}\\data\\gpkg\\exclusion\\Protected_Land.gpkg",
                       f"{base_dir}\\data\\gpkg\\exclusion\\Built_Up_Area.gpkg",
                       f"{base_dir}\\data\\gpkg\\exclusion\\Planning_Zones.gpkg"]
# --- Define Suitability Layers ---
# --- As these take many forms, using a dictionary will help iterate through different analysis types
# --- and treat each layer how it needs to be.
suitability_layers = [
    {   # Proximity to Transmission Grid
        "input_path": f"{base_dir}\\data\\gpkg\\suitability\\Transmission_Lines.gpkg",
        "measure": "proximity",
        "ideal_value": "lowest"
    },
    {   # Solar Radiation
        "input_path": f"{base_dir}\\data\\tif\\suitability\\solar_annual.tif",
        "measure": "raster value",
        "ideal_value": "highest"
    },
    {   # Land Area of Property Polygons
        "input_path": output_path,
        "measure": "geometry",
        "ideal_value": "highest"
    }
]

# ___________________________________ DATA PROCESSING _____________________________________________
# --- ERASE EXCLUSION AREAS FROM PROPERTY DATASET ---
merge_list = []
for layer_path in exclusion_path_list:
    layer_name = os.path.basename(layer_path).split(".")[0]
    dslv = processing.run("native:dissolve",
                               {'INPUT':layer_path,'FIELD':[],'SEPARATE_DISJOINT':False,
                                'OUTPUT': f"{scratch_dir}\\{layer_name}_dslv.gpkg"})
    merge_list.append(dslv["OUTPUT"])

erase = processing.run("native:multidifference", {'INPUT':property_layer_path,'OVERLAYS': merge_list,'OUTPUT': output_path})

# TODO: Delete slivers from erased property dataset - where output area < 0.5 * original area, or less than 4000sqm

# --- Create Property Centroid Points for Raster Sampling ---
property_point_path = f"{base_dir}\\outputs\\Property_Point.gpkg"
processing.run("native:centroids", {'INPUT':output_path,'ALL_PARTS':False,'OUTPUT': property_point_path})

# --- PROCESS SUITABILITY CRITERIA ---
# --- This section is a work in progress. Analysis for the case study was done manually in QGIS with the intention of
# --- converting to a repeatable script, but time constraints prevailed :(. Below is a demonstration of how different
# --- types of analysis can be treated by creating new functions to perform different tasks
for suitability in suitability_layers:
    if suitability["measure"] == "proximity":
        # Run proximity analysis - WORK IN PROGRESS
        proximity(suitability["input_layer"],AOI_layer_path, suitability["ideal_value"])
    elif suitability["measure"] == "raster_value":
        raster_value(suitability["input_path"], AOI_layer_path, suitability["ideal_value"])
    elif suitability["measure"] == "geometry":
        # run geomrety function (not created yet)
        pass
    break

# ---- STANDARDISE SUITABILITY CRITERIA VALUES TO 0-100 ---
output_layer = QgsVectorLayer(property_layer_path, "property_points", "ogr")
# TODO: Add suitabiltiy score fields
for feat in output_layer.getFeatures():
    # TODO: Calculate suitability scores
    pass