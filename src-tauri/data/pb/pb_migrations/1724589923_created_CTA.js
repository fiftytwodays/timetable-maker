/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "wr1whgb21nniips",
    "created": "2024-08-25 12:45:23.287Z",
    "updated": "2024-08-25 12:45:23.287Z",
    "name": "CTA",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "xkz5yjk5",
        "name": "class_sub_teach_ass",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "rf2gxdzyogk54mx",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "kyfcjfqn",
        "name": "day",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "q4ufevo6x5k4ehl",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "shtjjdho",
        "name": "period",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "3t45re1apt9cdh5",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
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
  const collection = dao.findCollectionByNameOrId("wr1whgb21nniips");

  return dao.deleteCollection(collection);
})
