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

    context.spark.sql(f"""
        INSERT INTO pv_test.jobs_status (
            id,
            job_id,
            last_run_time,
            status
        ) values ('{uuid.uuid4()}', '{job_id}', null, 'pending')
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


@then('I expect the table "{table_name}" to have "{expected_json}"')
def step_check_output_json(context, table_name, expected_json):
    """
    Assert that at least one row in the Delta table contains all key-value pairs
    from the expected JSON (extra columns are allowed).
    """
    try:
        expected_dict = json.loads(expected_json)
    except json.JSONDecodeError as e:
        raise AssertionError(f"❌ Invalid JSON in feature file: {expected_json}\nError: {e}")




    df = context.spark.sql(f"SELECT * FROM delta.`{table_name}` ORDER BY id DESC LIMIT 1")
    print(f"DATAFRAME: #{df}")
    rows = [row.asDict(recursive=True) for row in df.collect()]

    

    print("🔎 Table contents:", rows)
    if expected_json == '[]' and len(rows) == 0:
        return True

    match = any(
        all(row.get(k) == v for k, v in expected_dict.items())
        for row in rows
    )

    if not match:
        raise AssertionError(
            f"❌ Expected row not found in table {table_name}.\n"
            f"Expected (subset): {expected_dict}\n"
            f"Found: {rows}"
       )

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
