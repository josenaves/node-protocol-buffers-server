var _root = dcodeIO.ProtoBuf.newBuilder({})['import']({
    "package": "com.josenaves.android.websocket.client",
    "options": {
        "java_package": "com.josenaves.android.websocket.client"
    },
    "messages": [
        {
            "name": "Image",
            "fields": [
                {
                    "rule": "required",
                    "type": "string",
                    "name": "id",
                    "id": 1
                },
                {
                    "rule": "required",
                    "type": "string",
                    "name": "name",
                    "id": 2
                },
                {
                    "rule": "required",
                    "type": "string",
                    "name": "date",
                    "id": 3
                },
                {
                    "rule": "required",
                    "type": "bytes",
                    "name": "image_data",
                    "id": 4
                }
            ]
        }
    ]
}).build();