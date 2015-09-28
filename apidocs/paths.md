## Paths
### Landmarks close to your location
```
GET /landmarks
```

#### Description

The Landmarks endpoint delivers Landmark objects representing points of interest that are close by, and their relative location


#### Parameters
|Type|Name|Description|Required|Schema|Default|
|----|----|----|----|----|----|
|QueryParameter|latitude|Latitude component of location.|true|number (double)||
|QueryParameter|longitude|Longitude component of location.|true|number (double)||


#### Responses
|HTTP Code|Description|Schema|
|----|----|----|
|200|An array of landmarks|Landmark array|
|default|Unexpected error|Error|


#### Tags

* Landmarks

