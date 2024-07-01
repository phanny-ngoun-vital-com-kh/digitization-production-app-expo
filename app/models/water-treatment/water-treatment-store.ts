import {
  Activities,
  ActivitiesLogModel,
  Treatment,
  TreatmentModel,
} from "app/models/water-treatment/water-treatment-model"
import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { watertreatmentApi } from "app/services/api/water-treatment-api"
import { assignDailywtp2Api } from "app/services/api/assign-daily-wtp-api"
import { getDBConnection } from "app/lib/offline-db"

/**
 * Model description here for TypeScript hints.
 */
export const ShiftModel = types.model("Shift").props({
  shift: types.number,
  time: types.string,
  type: types.enumeration("ShiftType", ["A", "B", "C", "D"]),
  tsd_ppm: types.maybeNull(types.number),
  ph_level: types.maybeNull(types.number),
  temperature: types.maybeNull(types.number),
  pressure: types.maybeNull(types.number),
  air_release: types.maybeNull(types.boolean),
  other: types.maybeNull(types.string),
  press_inlet: types.maybeNull(types.number),
  press_treat: types.maybeNull(types.number),
  press_drain: types.maybeNull(types.number),
  odor: types.maybeNull(types.boolean),
  taste: types.maybeNull(types.boolean),
  checked_by: types.maybeNull(types.string),
  machines: types.maybeNull(types.string),
  inspection_status: types.maybeNull(types.boolean),
})

export const WaterTreatmentStoreModel = types
  .model("WaterTreatmentStore")
  .props({
    treatments: types.optional(types.array(TreatmentModel), []),
    items: types.optional(types.array(ActivitiesLogModel), []),
  })
  .actions((self) => {
    return {
      createWtpRequest: (wtp: Treatment) => {
        self.treatments.push(wtp)
        return wtp
      },
      createActivities: (activities: Activities) => {
        self.items.push(activities)
        return activities
      },
    }
  })
  .views((self) => {
    return {
      getWtpSchedules: async (assign_date = "2024-05-15", shift = "S1 (7:00)") => {
        const rs = await watertreatmentApi.getWtp2List({
          assign_date,
          shift,
        })

        if (rs.kind === "ok") {
          return rs.payload
        } else {
          console.log("Error")
          throw Error(rs.kind)
        }
      },

      loadWtp: async () => {
        const result = await watertreatmentApi.getTodayWtp()
        // console.log("Start wtp result", result)
        if (result?.kind === "ok") {
          return result.payload
        } else {
          console.log("Error")
          throw Error(result.kind)
        }
      },

      syncDataToserver: async () => {
        //when internet connection is available again
        try {
          console.log("Sync data")
          const db = await getDBConnection()
          const query = `SELECT t.*, tl.*
          FROM treatments t
          LEFT JOIN treatment_list tl
          ON t.treatment_id = tl.treatment_id
          WHERE t.is_synced = 1;`
          const updateSyncQuery = `UPDATE treatments SET is_synced = 0`
          if (query.length <= 0) {
            return
          }
          const rawQuery = await db.getAllAsync(query)
          await db.runAsync(updateSyncQuery)
          const mappedResult = rawQuery.reduce((acc, item) => {
            let treatment = acc.find((t) => t.treatment_id === item.treatment_id)
            if (!treatment) {
              treatment = {
                assign_to: item.assign_to,
                shift: item.shift,
                treatment_id: item.treatment_id,
                remark: item.remark,
                createdBy: item.createdBy,
                createdDate: item.createdDate,
                lastModifiedBy: item.lastModifiedBy,
                lastModifiedDate: item.lastModifiedDate,
                assign_date: item.assign_date,
                treatmentlist: [],
              }
              acc.push(treatment)
            }
            const treatmentListItem = {
              id: item.id,
              machine: item.machine,
              tds: item.tds,
              ph: item.ph,
              temperature: item.temperature,
              pressure: item.pressure,
              air_release: item.air_release,
              press_inlet: item.press_inlet,
              press_treat: item.press_treat,
              press_drain: item.press_drain,
              check_by: item.check_by,
              status: item.status,
              warning_count: item.warning_count,
              odor: item.odor,
              taste: item.taste,
              other: item.other,
              assign_to_user: item.assign_to_user,
              createdBy: item.createdBy,
              createdDate: item.createdDate,
              lastModifiedBy: item.lastModifiedBy,
              lastModifiedDate: item.lastModifiedDate,
            }
            treatment.treatmentlist.push(treatmentListItem)
            return acc
          }, [])

          console.log("Mapped result", mappedResult?.length)

          for (const row of mappedResult) {
            const rs = await watertreatmentApi.saveWtp2({
              tds: row?.tds ?? null,
              ph: row?.ph ?? null,
              temperature: row?.temperature ?? null,
              other: row?.other,
              air_release: row?.air_release ?? null,
              machine: row?.machine,
              status: row?.status ?? "pending",
              id: row?.id,
              action: row?.action ?? "N / A",
              warning_count: row?.warning_count ?? null,
              press_inlet: row?.press_inlet ?? null,
              press_treat: row?.press_treat ?? null,
              press_drain: row?.press_drain ?? null,
              odor: row?.odor,
              taste: row?.taste,
              assign_to_user: row?.assign_to_user ?? null,
              treatment_id: row?.treatment_id ?? null,
              pressure: row?.pressure,
            })
            if (rs.kind === "ok") console.log("Success")
            else {
              console.log("Error")
              throw Error(rs.kind)
            }
          }
        } catch (error: any) {
          console.error(error)
          throw Error(error?.message)
        }
      },

      loadTreatmentLocal: async () => {
        try {
          const db = await getDBConnection()

          const query = `SELECT t.*, tl.*
        FROM treatments t
        INNER JOIN treatment_list tl
        ON t.treatment_id = tl.treatment_id;`

          const result = await db.getAllAsync<any>(query)
          const mappedResult = result.reduce((acc, item) => {
            let treatment = acc.find((t) => t.treatment_id === item.treatment_id)
            if (!treatment) {
              treatment = {
                assign_to: item.assign_to,
                shift: item.shift,
                treatment_id: item.treatment_id,
                remark: item.remark,
                createdBy: item.createdBy,
                createdDate: item.createdDate,
                lastModifiedBy: item.lastModifiedBy,
                lastModifiedDate: item.lastModifiedDate,
                assign_date: item.assign_date,
                treatmentlist: [],
              }
              acc.push(treatment)
            }
            const treatmentListItem = {
              id: item.id,
              machine: item.machine,
              tds: item.tds,
              ph: item.ph,
              temperature: item.temperature,
              pressure: item.pressure,
              air_release: item.air_release,
              press_inlet: item.press_inlet,
              press_treat: item.press_treat,
              press_drain: item.press_drain,
              check_by: item.check_by,
              status: item.status,
              warning_count: item.warning_count,
              odor: item.odor,
              taste: item.taste,
              other: item.other,
              assign_to_user: item.assign_to_user,
              createdBy: item.createdBy,
              createdDate: item.createdDate,
              lastModifiedBy: item.lastModifiedBy,
              lastModifiedDate: item.lastModifiedDate,
            }
            treatment.treatmentlist.push(treatmentListItem)
            return acc
          }, [])
          return mappedResult
        } catch (error: any) {
          console.error(error)
          throw Error(error?.message)
        } finally {
          console.log("loadTreatmentLocal is loaded")
        }
      },
      getOfflineWtp: async (assign_date: string, selectedShift: string) => {
        try {
          const db = await getDBConnection()
          const query = `SELECT t.*, tl.*
          FROM treatments t
          INNER JOIN treatment_list tl
          ON t.treatment_id = tl.treatment_id
          AND t.assign_date LIKE ?
          AND t.shift = ?;`
          const args = `${assign_date}%` // Use wildcard search pattern
          const result = await db.getAllAsync<any>(query, [args, selectedShift])
          const mappedResult = result.reduce((acc, item) => {
            let treatment = acc.find((t) => t.treatment_id === item.treatment_id)
            if (!treatment) {
              treatment = {
                assign_to: item.assign_to,
                shift: item.shift,
                treatment_id: item.treatment_id,
                remark: item.remark,
                createdBy: item.createdBy,
                createdDate: item.createdDate,
                lastModifiedBy: item.lastModifiedBy,
                lastModifiedDate: item.lastModifiedDate,
                assign_date: item.assign_date,
                treatmentlist: [],
              }
              acc.push(treatment)
            }
            const treatmentListItem = {
              id: item.id,
              machine: item.machine,
              tds: item.tds,
              ph: item.ph,
              temperature: item.temperature,
              pressure: item.pressure,
              air_release: item.air_release,
              press_inlet: item.press_inlet,
              press_treat: item.press_treat,
              press_drain: item.press_drain,
              check_by: item.check_by,
              status: item.status,
              warning_count: item.warning_count,
              odor: item.odor,
              taste: item.taste,
              other: item.other,
              assign_to_user: item.assign_to_user,
              createdBy: item.createdBy,
              createdDate: item.createdDate,
              lastModifiedBy: item.lastModifiedBy,
              lastModifiedDate: item.lastModifiedDate,
            }
            treatment.treatmentlist.push(treatmentListItem)
            return acc
          }, [])
          return mappedResult
        } catch (error: any) {
          console.error(error)
          throw Error(error?.message)
        } finally {
          console.log("loadTreatmentLocal is loaded")
        }
      },
      getOfflineWtpByDate: async (assign_date: string) => {
        try {
          const db = await getDBConnection()
          const query = `SELECT t.*, tl.*
          FROM treatments t
          INNER JOIN treatment_list tl
          ON t.treatment_id = tl.treatment_id
          AND t.assign_date LIKE ?;`
          const args = `${assign_date}%` // Use wildcard search pattern
          const result = await db.getAllAsync<any>(query, [args])

          console.log("Result is ", result?.length)
          const mappedResult = result.reduce((acc, item) => {
            let treatment = acc.find((t) => t.treatment_id === item.treatment_id)
            if (!treatment) {
              treatment = {
                assign_to: item.assign_to,
                shift: item.shift,
                treatment_id: item.treatment_id,
                remark: item.remark,
                createdBy: item.createdBy,
                createdDate: item.createdDate,
                lastModifiedBy: item.lastModifiedBy,
                lastModifiedDate: item.lastModifiedDate,
                assign_date: item.assign_date,
                treatmentlist: [],
              }
              acc.push(treatment)
            }
            const treatmentListItem = {
              id: item.id,
              machine: item.machine,
              tds: item.tds,
              ph: item.ph,
              temperature: item.temperature,
              pressure: item.pressure,
              air_release: item.air_release,
              press_inlet: item.press_inlet,
              press_treat: item.press_treat,
              press_drain: item.press_drain,
              check_by: item.check_by,
              status: item.status,
              warning_count: item.warning_count,
              odor: item.odor,
              taste: item.taste,
              other: item.other,
              assign_to_user: item.assign_to_user,
              createdBy: item.createdBy,
              createdDate: item.createdDate,
              lastModifiedBy: item.lastModifiedBy,
              lastModifiedDate: item.lastModifiedDate,
            }
            treatment.treatmentlist.push(treatmentListItem)
            return acc
          }, [])
          return mappedResult
        } catch (error: any) {
          console.error(error)
          throw Error(error?.message)
        } finally {
          console.log("loadTreatmentLocal is loaded")
        }
      },

      getWtpByDate: async (assign_date = "2024-05-15") => {
        const rs = await watertreatmentApi.getWtp2ListByDate({
          assign_date,
        })
        if (rs.kind === "ok") {
          return rs.payload
        } else {
          console.log("Error")
          throw Error(rs.kind)
        }
      },

      getTreatmentActivities: async (treatment_id = "", pageSize = 0) => {
        const rs = await watertreatmentApi.getActivitiesByTreatment(pageSize, treatment_id)
        if (rs.kind === "ok") {
          return rs.payload
        } else {
          console.log("Error")
          throw Error(rs.kind)
        }
      },
      getTreatmentActivitiesMachine: async (machine_id = "", pageSize = 0) => {
        const rs = await watertreatmentApi.getActivitiesByMachine(pageSize, machine_id)
        if (rs.kind === "ok") {
          return rs.payload
        } else {
          console.log("Error")
          throw Error(rs.kind)
        }
      },
      assignTask: async (shiftuser: string, user: string, date: string) => {
        const rs = await assignDailywtp2Api.saveAssign({
          shift: shiftuser,
          assign_to: user,
          remark: "N / A",
          assign_date: date,
          activities: [{ action: "Assign to ware1" }],
          treatmentlist: [
            {
              machine: "Raw Water Stock",
            },
            {
              machine: "Sand Filter",
            },
            {
              machine: "Carbon Filter",
            },
            {
              machine: "Resin Filter",
            },
            {
              machine: "Microfilter 5µm",
            },
            {
              machine: "Microfilter 1µm",
            },
            {
              machine: "Reverses Osmosis",
            },
          ],
        })
        if (rs.kind === "ok") {
          return rs.payload
        } else {
          console.log("Error")
          throw Error(rs.kind)
        }
      },
      assignMachine: async (id: string, action: string, treatment_id: string) => {
        const rs = await watertreatmentApi.saveAssign({
          id,
          action,
          treatment_id,
        })
        if (rs.kind === "ok") {
          return rs.payload
        } else {
          console.log("Error")
          throw Error(rs.kind)
        }
      },
    }
  })

export interface WaterTreatmentStore extends Instance<typeof WaterTreatmentStoreModel> {}
export interface WaterTreatmentStoreSnapshotOut
  extends SnapshotOut<typeof WaterTreatmentStoreModel> {}
export interface WaterTreatmentStoreSnapshotIn
  extends SnapshotIn<typeof WaterTreatmentStoreModel> {}
export const createWaterTreatmentStoreDefaultModel = () =>
  types.optional(WaterTreatmentStoreModel, {})
