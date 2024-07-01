import { Treatment } from "app/models"
import * as SQLite from "expo-sqlite"
export const openConnection = async () => {
  const db = await SQLite.openDatabaseAsync("dbtest")
  await db.execAsync("PRAGMA journal_mode = WAL")
  await db.execAsync("PRAGMA foreign_keys = OFF")
  return db
}
export const getDBConnection = async () => {
  try {
    const db = await SQLite.openDatabaseAsync("dbtest")
    return db
  } catch (error) {
    console.error("getDBConnection", error)
  }
}
export const closeDb = async () => {
  const db = await SQLite.openDatabaseAsync("dbtest")
  await db.closeAsync()
}
// Function to create the treatments table
export const createTables = async () => {
  const db = await openConnection()
  try {
    await db.execAsync(`
        DROP TABLE IF EXISTS treatments;
        CREATE TABLE treatments (
          assign_to TEXT,
          shift TEXT,
          treatment_id TEXT PRIMARY KEY,
          remark TEXT,
          createdBy TEXT,
          createdDate TEXT,
          lastModifiedBy TEXT,
          lastModifiedDate TEXT,
          assign_date TEXT,
          is_synced INTEGER DEFAULT 0 
        );
      `)
    await db.execAsync(`
      DROP TABLE IF EXISTS assignself;
      CREATE TABLE assignself (
        id TEXT PRIMARY KEY,
        action TEXT DEFAULT 'Assign Role Self',
        treatment_id TEXT,
        is_synced INTEGER DEFAULT 0 
      );
    `)

    await db.execAsync(`
        DROP TABLE IF EXISTS treatment_list;
        CREATE TABLE treatment_list (
          id INTEGER PRIMARY KEY,
          machine TEXT,
          treatment_id TEXT,
          tds REAL,
          ph REAL,
          temperature REAL,
          pressure REAL,
          air_release REAL,
          press_inlet REAL,
          press_treat REAL,
          press_drain REAL,
          check_by TEXT,
          status TEXT,
          warning_count INTEGER,
          odor TEXT,
          taste TEXT,
          other TEXT,
          assign_to_user TEXT,
          createdBy TEXT,
          createdDate TEXT,
          lastModifiedBy TEXT,
          lastModifiedDate TEXT,
          FOREIGN KEY (treatment_id) REFERENCES treatments(treatment_id)
        );
        `)
    await db.execAsync(`
        DROP TABLE IF EXISTS pre_treatments;
        CREATE TABLE pre_treatments (
          assign_to TEXT,
          time TEXT,
          assign_date TEXT,
          pretreatment_id TEXT PRIMARY KEY,
          pre_treatment_type TEXT,
          remark TEXT,
          createdBy TEXT,
          createdDate TEXT,
          lastModifiedBy TEXT,
          lastModifiedDate TEXT,
          is_synced INTEGER DEFAULT 0 
        );
      `)

    await db.execAsync(`
      DROP TABLE IF EXISTS pretreatmentlist;
      CREATE TABLE pretreatmentlist (
        id INTEGER PRIMARY KEY,
        control TEXT,
        pretreatment_id TEXT,
        pre_treatment_type TEXT,
        action TEXT,
        check_by TEXT,
        sf TEXT,
        acf TEXT,
        resin TEXT,
        um5 TEXT,
        sf1 TEXT,
        sf2 TEXT,
        acf1 TEXT,
        acf2 TEXT,
        um101 TEXT,
        um102 TEXT,
        raw_water TEXT,
        buffer_st002 TEXT,
        status TEXT,
        warning_count INTEGER,
        assign_to_user TEXT,
        remark TEXT,
        createdBy TEXT,
        createdDate TEXT,
        lastModifiedBy TEXT,
        lastModifiedDate TEXT,
        FOREIGN KEY (pretreatment_id) REFERENCES pre_treatments(pretreatment_id)
      );
    `)

    await db.execAsync(`
    DROP TABLE IF EXISTS lines;
    CREATE TABLE lines (
      id INTEGER PRIMARY KEY,
      haccp_id TEXT,
      assign_to TEXT,
      line TEXT,
      assign_date TEXT,
      remark TEXT,
      createdBy TEXT,
      createdDate TEXT,
      lastModifiedBy TEXT,
      lastModifiedDate TEXT,
      is_synced INTEGER DEFAULT 0 
    );
  `)
    await db.execAsync(`
      DROP TABLE IF EXISTS haccplist;
      CREATE TABLE haccplist (
        id INTEGER PRIMARY KEY,
        haccp_id TEXT,
        item_name TEXT,
        item_value TEXT,
        status TEXT,
        assign_to_user TEXT,
        createdBy TEXT,
        createdDate TEXT,
        lastModifiedBy TEXT,
        lastModifiedDate TEXT,
        FOREIGN KEY (haccp_id) REFERENCES lines(haccp_id)
      );
    `)
  } catch (error) {
    console.error("Error at Create Table", error)
  } finally {
    console.log("TABLE  CREATED")
  }
}
