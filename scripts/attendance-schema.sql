-- ─── A7 Attendance System — schema ─────────────────────────────────────────
-- Idempotent: safe to run more than once.

CREATE TABLE IF NOT EXISTS employees (
  id            SERIAL PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  password_hash TEXT,                    -- NULL until first-login password set
  role          TEXT NOT NULL DEFAULT 'employee'
                CHECK (role IN ('employee', 'admin')),
  active        BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Case-insensitive email lookup (people type inconsistently).
CREATE UNIQUE INDEX IF NOT EXISTS employees_email_lower_idx
  ON employees (lower(email));

CREATE TABLE IF NOT EXISTS attendance (
  id                  SERIAL PRIMARY KEY,
  employee_id         INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  clock_in_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  clock_out_at        TIMESTAMPTZ,             -- NULL = shift still open
  clock_in_photo_url  TEXT,
  clock_out_photo_url TEXT,
  -- Work date in IST, so a shift belongs to the day it started locally.
  work_date           DATE NOT NULL
                      DEFAULT ((now() AT TIME ZONE 'Asia/Kolkata')::date),
  note                TEXT,                    -- admin correction reason
  corrected_by        INTEGER REFERENCES employees(id),
  CONSTRAINT clock_out_after_in
    CHECK (clock_out_at IS NULL OR clock_out_at >= clock_in_at)
);

-- THE key safety guarantee: an employee can have at most ONE open shift.
-- Makes double clock-in structurally impossible, regardless of races or UI bugs.
CREATE UNIQUE INDEX IF NOT EXISTS attendance_one_open_shift
  ON attendance (employee_id)
  WHERE clock_out_at IS NULL;

-- Fast lookups for dashboards and monthly payroll reports.
CREATE INDEX IF NOT EXISTS attendance_employee_date_idx
  ON attendance (employee_id, work_date DESC);

CREATE INDEX IF NOT EXISTS attendance_work_date_idx
  ON attendance (work_date DESC);
