## Definitions
### Location
|Name|Description|Required|Schema|Default|
|----|----|----|----|----|
|latitude|Latitude component of location.|false|number (double)||
|longitude|Longitude component of location.|false|number (double)||


### Landmark
|Name|Description|Required|Schema|Default|
|----|----|----|----|----|
|description|Description of the history of a landmark.|false|string||
|geofence|An array of four location objects that encompass a geofence around the landmark.|false|Location array||
|date|Date constructed.|false|string||
|images|An array of image URLs associated with the landmark|false|string array||


### Error
|Name|Description|Required|Schema|Default|
|----|----|----|----|----|
|code||false|integer (int32)||
|message||false|string||
|fields||false|string||


