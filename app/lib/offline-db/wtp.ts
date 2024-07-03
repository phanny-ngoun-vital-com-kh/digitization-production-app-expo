import { Treatment } from "app/models"
import { getDBConnection } from "."
import * as SQLite from "expo-sqlite"

// Function to get a database connection

// Function to load all treatments from the database

export const loadAllTreatments = async () => {
  try {
    const db = await getDBConnection()
    const result = await db?.getAllAsync<Treatment>(`SELECT t.*, tl.*
    FROM treatments t
    LEFT JOIN treatment_list tl
    ON t.treatment_id = tl.treatment_id;
    END TRANSACTION;
    `)

    return result
  } catch (error) {
    console.error("loadAllTreatments", error)
    return {
      error: error,
    }
  }
}
export const syncDataWTP = async () => {
  try {
    const db = await getDBConnection()
    const result = await db?.getAllAsync<Treatment>("SELECT * FROM treatments;END TRANSACTION;")
    return result
  } catch (error) {
    console.error("Syntdata", error)
    return {
      error: error,
    }
  }
}

export const saveTreatment = async (treatment) => {
  const db = await getDBConnection()
  const statement = await db?.prepareAsync(
    `INSERT INTO treatments 
      (shift, time, type, tsd_ppm, ph_level, temperature, pressure, air_release, other, press_inlet, press_treat, press_drain, odor, taste, checked_by, machines, inspection_status, synced) 
     VALUES 
      ($shift, $time, $type, $tsd_ppm, $ph_level, $temperature, $pressure, $air_release, $other, $press_inlet, $press_treat, $press_drain, $odor, $taste, $checked_by, $machines, $inspection_status, $synced);`,
  )
  try {
    await statement?.executeAsync({
      $shift: treatment.shift,
      $time: treatment.time,
      $type: treatment.type,
      $tsd_ppm: treatment.tsd_ppm,
      $ph_level: treatment.ph_level,
      $temperature: treatment.temperature,
      $pressure: treatment.pressure,
      $air_release: treatment.air_release,
      $other: treatment.other,
      $press_inlet: treatment.press_inlet,
      $press_treat: treatment.press_treat,
      $press_drain: treatment.press_drain,
      $odor: treatment.odor,
      $taste: treatment.taste,
      $checked_by: treatment.checked_by,
      $machines: treatment.machines,
      $inspection_status: treatment.inspection_status,
      $synced: treatment.synced ? 1 : 0,
    })
  } finally {
    await statement?.finalizeAsync()
  }
}

export const saveAssignTreatment = async (
  id: string,
  action: string,
  treatment_id: string,
): Promise<{ success: number } | undefined> => {
  try {
    // console.log("Updating assignment treatment", id, action, treatment_id)
    const db = await getDBConnection()
    console.log("Update action", action)
    db?.withExclusiveTransactionAsync(async () => {
      const data = await db?.runAsync(
        `UPDATE treatment_list
      SET assign_to_user = ?
      WHERE id = ? AND treatment_id = ?;`,
        [action, id, treatment_id],
      )
      // console.log(data.lastInsertRowId,data.changes);
      await db?.runAsync(
        `
      INSERT OR REPLACE INTO assignself 
      (id, action, treatment_id,is_synced) 
      VALUES 
      (?, ?, ?, ?);
    `,
        [id, "Assign Role Self", treatment_id, 1],
      )
    })
  } catch (error) {
    console.error("error Assign self", error)
  } finally {
    console.log("Assignment treatment updated successfully")

    return {
      success: 200,
    }
  }
}
export const getMachineActivity = async (treatment_id) => {
  try {
    const db = await getDBConnection()
    const result = await db?.getAllAsync<any>(`SELECT t.*, tl.*
    FROM treatments t
    LEFT JOIN treatment_list tl
    ON t.treatment_id = tl.treatment_id;
    END TRANSACTION;`)
    return result
  } catch (error) {
    console.error(error)
    return {
      error: error,
    }
  }
}

export const updateUserRole = async (treatment) => {
  try {
    const db = await getDBConnection()
    const result = await db?.getAllAsync<any>(`SELECT t.*, tl.*
    FROM treatments t
    LEFT JOIN treatment_list tl
    ON t.treatment_id = tl.treatment_id;
    END TRANSACTION;`)
    return result
  } catch (error) {
    console.error(error)
    return {
      error: error,
    }
  }
}

export const getActivityLog = async (treatment) => {
  try {
    const db = await getDBConnection()
    const result = await db?.getAllAsync<any>(`SELECT t.*, tl.*
    FROM treatments t
    LEFT JOIN treatment_list tl
    ON t.treatment_id = tl.treatment_id;
    END TRANSACTION;`)
    return result
  } catch (error) {
    console.error(error)
    return {
      error: error,
    }
  }
}
export const updateActivityLog = async (treatment) => {
  try {
    const db = await getDBConnection()
    const result = await db?.getAllAsync<any>(`SELECT t.*, tl.*
    FROM treatments t
    LEFT JOIN treatment_list tl
    ON t.treatment_id = tl.treatment_id;`)
    return result
  } catch (error) {
    console.error(error)
    return {
      error: error,
    }
  }
}
