# features/steps/job_scheduler_steps.py
import time
import json
import uuid
from behave import given, when, then
from job_scheduler.job_scheduler import JobScheduler, next_cron
from datetime import datetime
from pyspark.sql.functions import lit, col
from job_scheduler.job_scheduler import next_cron

@given('Job def "{name}", "{type}", "{query}", "{frequency}", "{query_output_table}"')
def step_job_definition(context, name, type, query, frequency, query_output_table):
    """
    Insert a job definition into the pv_test.jobs table
    """
    job_id = uuid.uuid4()
    context.spark.sql(f"""
        INSERT INTO pv_test.jobs (id, name, type, query, frequency, query_output_table)
        VALUES ('{job_id}', '{name}', '{type}', '{query}', '{frequency}', '{query_output_table}')
    """)


@when('run a job {times:d} time(s) with wait {seconds:d}"')
def step_run_single_job(context, times, seconds):
    """
    Run the JobScheduler.run_single_job method and wait for specified seconds
    """
    scheduler = JobScheduler(context.spark, prefix="pv_test")  # adjust prefix if needed
    for i in range(times):
        scheduler.run_single_job()
        time.sleep(seconds)

@then('I expect the table "{table_name}" to have {record:d} record(s)')
def step_check_output_table(context, table_name, record):
    """
    Check table content against some expected value (could be row count or JSON)
    """
    df = context.spark.sql(f"SELECT * FROM delta.`{table_name}`")
    count = df.count()
    assert count == record, f"Expected {record} rows, got {count}"


@then('I expect the SQL QUERY "{sql_query}" to have "{expected_json}"')
def step_check_output_json(context, sql_query, expected_json):
    """
    Assert that the last row(s) in the Delta table match the expected JSON(s).
    - If expected_json is an object, check only the last row.
    - If expected_json is an array of objects, check the last N rows in order.
    Extra columns in the table are allowed.
    """
    # Parse JSON
    try:
        parsed_json = json.loads(expected_json)
    except json.JSONDecodeError as e:
        raise AssertionError(f"❌ Invalid JSON in feature file: {expected_json}\nError: {e}")

    df = context.spark.sql(f"{sql_query}")

    rows = [row.asDict(recursive=True) for row in df.collect()]

    print("🔎 Table contents:", rows)

    if expected_json == '[]' and len(rows) == 0:
        return True

    if not rows:
        raise AssertionError(f"❌ No rows found in table {sql_query}")

    # If parsed_json is a dict → single row check
    if isinstance(parsed_json, dict):
        last_row = rows[-1]
        match = all(last_row.get(k) == v for k, v in parsed_json.items())
        if not match:
            raise AssertionError(
                f"❌ Expected last row in {sql_query} to contain {parsed_json}\n"
                f"Found: {last_row}"
            )
        return True

    # If parsed_json is a list → check last N rows
    if isinstance(parsed_json, list):
        expected_count = len(parsed_json)
        if len(rows) < expected_count:
            raise AssertionError(
                f"❌ Not enough rows in {sql_query} to check last {expected_count}\n"
                f"Found only {len(rows)} rows"
            )

        last_n_rows = rows[-expected_count:]
        for i, expected_dict in enumerate(parsed_json):
            actual_row = last_n_rows[i]
            match = all(actual_row.get(k) == v for k, v in expected_dict.items())
            if not match:
                raise AssertionError(
                    f"❌ Row {i+1} from the last {expected_count} rows in {sql_query} does not match.\n"
                    f"Expected: {expected_dict}\n"
                    f"Found: {actual_row}"
                )
        return True

    raise AssertionError(f"❌ Unsupported JSON format: {expected_json}")

@then('the job status for "{job_name}" should be "{status}"')
def step_check_job_status(context, job_name, status):
    df = context.spark.sql(f"SELECT status FROM pv_test.jobs_status js JOIN pv_test.jobs j ON js.job_id = j.id WHERE j.name = '{job_name}'")
    rows = df.collect()
    print(f"df: {df} \n rows: {rows}")
    assert rows, f"No status found for job {job_name}"
    assert rows[0].status == status, f"Expected {status}, got {rows[0].status}"


@given('string input "{string_input}"')
def step_test_next_cron_func(context, string_input):
    # Store the cron string for later
    context.input_str = string_input

@when('time is "{time}"')
def step_and_time(context, time):
    # Create a one-row DataFrame to hold the timestamp
    df = context.spark.createDataFrame([(time,)], ["now"])
    
    # Apply the UDF column
    df = df.withColumn("next_time", next_cron(lit(context.input_str), col("now")))
    
    # Collect the result to Python
    context.output_str = df.collect()[0]["next_time"]

    #print(next_cron_func(context.input_str, time))

@then('I expect the output to be "{output}"')
def step_check_output_str(context, output):
    result = context.output_str
    print(f"RESULT: {result}")
    assert result == output, f"String result ({result}) does not match expected output ({output})"

@given('the following jobs are defined:')
def step_define_jobs_table(context):
    """
    Insert multiple job definitions from a table.
    """
    for row in context.table:
        context.spark.sql(f"""
            INSERT INTO pv_test.jobs (id, name, type, query, frequency, query_output_table)
            VALUES ('{uuid.uuid4()}', '{row['name']}', '{row['type']}', '{row['query']}', '{row['frequency']}', '{row['output_table']}')
        """)
