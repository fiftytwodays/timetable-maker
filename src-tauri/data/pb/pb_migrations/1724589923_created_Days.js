/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "q4ufevo6x5k4ehl",
    "created": "2024-08-25 12:45:23.288Z",
    "updated": "2024-08-25 12:45:23.288Z",
    "name": "Days",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "wddog7uq",
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
  const collection = dao.findCollectionByNameOrId("q4ufevo6x5k4ehl");

  return dao.deleteCollection(collection);
})
