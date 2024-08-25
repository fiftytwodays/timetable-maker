/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "3t45re1apt9cdh5",
    "created": "2024-08-25 12:45:23.289Z",
    "updated": "2024-08-25 12:45:23.289Z",
    "name": "Periods",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "i0jcmwsu",
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
      },
      {
        "system": false,
        "id": "eyrz9ge8",
        "name": "duration",
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
  const collection = dao.findCollectionByNameOrId("3t45re1apt9cdh5");

  return dao.deleteCollection(collection);
})
