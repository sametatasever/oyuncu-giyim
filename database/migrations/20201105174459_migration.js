const Knex = require("knex");
const { tableNames } = require("../tableNames");

/**
 * @param {Knex} knex
 */
exports.up = async function (knex) {
  await knex.schema
    .createTable(tableNames.language, (table) => {
      table.increments();
      table.string("name").notNullable();
      table.string("code").unique();
      table.string("flag_code");
      table.integer("sort_order");
      table.boolean("status").defaultTo(true);
      table.boolean("is_default").defaultTo(false);
    })
    .createTable(tableNames.category, (table) => {
      table.increments();
      table
        .integer("parent_id")
        .references("id")
        .inTable(tableNames.category)
        .onDelete("cascade")
        .defaultTo(null);
      table.integer("sort_order");
      table.boolean("status").defaultTo(true);
    })
    .createTable(tableNames.category_description, (table) => {
      table.increments();
      table
        .integer("category_id")
        .references("id")
        .inTable(tableNames.category)
        .onDelete("cascade");
      table
        .integer("language_id")
        .references("id")
        .inTable(tableNames.language)
        .onDelete("cascade");
      table.string("name").notNullable();
      table.text("description");
      table.string("meta_title");
      table.string("meta_description", 500);
      table.string("meta_keywords", 500);
      table.string("slug").notNullable();
    })
    .createTable(tableNames.desktop_menu, (table) => {
      table.increments();
      table.integer("sort_order");
      table.boolean("is_divider").defaultTo(false);
      table.boolean("status").defaultTo(true);
    })
    .createTable(tableNames.desktop_menu_description, (table) => {
      table.increments();
      table
        .integer("desktop_menu_id")
        .references("id")
        .inTable(tableNames.desktop_menu)
        .onDelete("cascade");
      table
        .integer("language_id")
        .references("id")
        .inTable(tableNames.language)
        .onDelete("cascade");
      table.string("name").notNullable();
      table.string("href");
      table.string("target").defaultTo("_self");
      table.string("icon_url");
    })
    .createTable(tableNames.mobile_menu, (table) => {
      table.increments();
      table.integer("sort_order");
      table.boolean("status").defaultTo(true);
    })
    .createTable(tableNames.mobile_menu_description, (table) => {
      table.increments();
      table
        .integer("mobile_menu_id")
        .references("id")
        .inTable(tableNames.mobile_menu)
        .onDelete("cascade");
      table
        .integer("language_id")
        .references("id")
        .inTable(tableNames.language)
        .onDelete("cascade");
      table.string("name").notNullable();
      table.string("href");
      table.string("target").defaultTo("_self");
      table.string("icon_url");
    });
};

/**
 * @param {Knex} knex
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists(tableNames.category_description);
  await knex.schema.dropTableIfExists(tableNames.category);
  await knex.schema.dropTableIfExists(tableNames.desktop_menu_description);
  await knex.schema.dropTableIfExists(tableNames.desktop_menu);
  await knex.schema.dropTableIfExists(tableNames.mobile_menu_description);
  await knex.schema.dropTableIfExists(tableNames.mobile_menu);
  await knex.schema.dropTableIfExists(tableNames.language);
};
