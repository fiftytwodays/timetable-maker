/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "wux9z9xf4gkbssa",
    "created": "2024-08-25 12:45:23.289Z",
    "updated": "2024-08-25 12:45:23.289Z",
    "name": "Teachers",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "xdlbmutp",
        "name": "name",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "indexes": [],
    "listRule": "",
    "viewRule": "",
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("wux9z9xf4gkbssa");

  return dao.deleteCollection(collection);
})
