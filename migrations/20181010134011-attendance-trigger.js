module.exports = {
  up: queryInterface => queryInterface.sequelize.query(`
        CREATE OR REPLACE FUNCTION process_attendances_update ()
            RETURNS TRIGGER
        AS $Members$
        BEGIN
            UPDATE
                "Members"
            SET
                "lastAttendance" = CURRENT_TIMESTAMP
            WHERE
                "id" = NEW."memberId";
            RETURN NEW;
        END;
        $Members$
        LANGUAGE plpgsql;

        CREATE TRIGGER "Members" AFTER INSERT ON "Attendances" FOR EACH ROW EXECUTE PROCEDURE process_attendances_update ();
    `),
  down: queryInterface => queryInterface.sequelize.query(`
        DROP TRIGGER IF EXISTS "Members" ON "Attendances";
        DROP FUNCTION IF EXISTS process_attendances_update;
  `),
};
