# features/authentication.feature

Feature: test jobs
  @clean_check
  Scenario: clean check
    Given Job def "foo2", "bar2", "SELECT * FROM pv_test.auth_groups", "* * * * *", "/data/pv_test/jobs_outputs/foo-output"
    When run a job 1 time(s) with wait 30"
    Then I expect the table "/data/pv_test/jobs_outputs/foo-output" to have "{"id":"1","name":"foo","create_table":true}"

  @first_job_check
  Scenario: 1 job check
    Given Job def "foo2", "bar2", "SELECT * FROM pv_test.auth_groups", "* * * * *", "/data/pv_test/jobs_outputs/foo-output"
    When run a job 1 time(s) with wait 30"
    Then I expect the table "/data/pv_test/jobs_outputs/foo-output" to have 1 record(s)

  @second_job_check
  Scenario: 2 jobs check
    Given Job def "foo2", "bar2", "SELECT * FROM pv_test.auth_groups", "* * * * *", "/data/pv_test/jobs_outputs/foo-output"
    When run a job 2 time(s) with wait 30"
    Then I expect the table "/data/pv_test/jobs_outputs/foo-output" to have 2 record(s)

  @job_status
  Scenario: Failed job should update status
    Given Job def "bad_job", "bar2", "SELECT * FROM non_existing_table", "* * * * *", "/data/pv_test/jobs_outputs/foo-output"
    When run a job 1 time(s) with wait 30"
    Then I expect the table "/data/pv_test/jobs_status" to have "{"status":"failed"}"

  @next_cron
  Scenario: Testing next_cron func
    Given string input "* * * * *"
    When time is "2025-09-15T14:36:01"
    Then I expect the output to be "2025-09-15T14:37:00"

  @multiple_jobs
  Scenario: Running multiple jobs at once
    Given the following jobs are defined:
      | name  | type | query                        | frequency   | output_table                          |
      | foo2  | bar2 | SELECT * FROM pv_test.auth_groups | * * * * * | /data/pv_test/jobs_outputs/foo-output |
      | foo3  | bar2 | SELECT * FROM pv_test.auth_groups | * * * * * | /data/pv_test/jobs_outputs/foo-output |
    When run a job 1 time(s) with wait 30"
    Then I expect the table "/data/pv_test/jobs_outputs/foo-output" to have 2 record(s)

  @run_no_jobs
  Scenario: Running no jobs
    When run a job 1 time(s) with wait 1"
    Then I expect the table "/data/pv_test/jobs_status" to have "[]"

  Scenario: Check pending status
    Given Job def "bad_job", "bar2", "SELECT * FROM non_existing_table", "* * * * *", "/data/pv_test/jobs_outputs/foo-output"
    When run a job 1 time(s) with wait 0"
    Then I expect the table "/data/pv_test/jobs_status" to have "{"status":"pending"}"

  @retry_failed_job
  Scenario: Retry failed jobs
    Given Job def "bad_job", "bar2", "SELECT FROM non_existing_table", "* * * * *", "/data/pv_test/jobs_outputs/foo-output"
    When run a job 1 time(s) with wait 30"
    Then I expect the table "/data/pv_test/jobs_status" to have "{"status":"failed"}"
    And I expect the table "/data/pv_test/jobs_status" to have 1 record(s)
    When run a job 1 time(s) with wait 30"
    Then I expect the table "/data/pv_test/jobs_status" to have "{"status":"failed"}"
    And I expect the table "/data/pv_test/jobs_status" to have 1 record(s)
