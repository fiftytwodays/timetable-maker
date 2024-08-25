/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "fbzt4td201u9xqs",
    "created": "2024-08-25 12:45:23.289Z",
    "updated": "2024-08-25 12:45:23.289Z",
    "name": "Subjects",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "ckwb42yt",
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
  const collection = dao.findCollectionByNameOrId("fbzt4td201u9xqs");

  return dao.deleteCollection(collection);
})
