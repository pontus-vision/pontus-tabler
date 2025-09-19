from behave import fixture, use_fixture
from pyspark.sql import SparkSession
from pyspark.conf import SparkConf
import uuid
import sys
import os
from delta.tables import DeltaTable

job_scheduler_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
sys.path.insert(0, job_scheduler_dir)
work_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
sys.path.insert(0, work_dir)  # now Python can import from work-dir

@fixture
def spark_context(context):
    conf = SparkConf() \
        .setAppName("job-scheduler") \
        .setMaster("local[*]") \
        .set("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension") \
        .set("spark.sql.catalog.spark_catalog", "org.apache.spark.sql.delta.catalog.DeltaCatalog")

    context.spark = SparkSession.builder.config(conf=conf).getOrCreate()
    context.sc = context.spark.sparkContext
    # to be able to use paths.py in job's files
    context.sc.addPyFile(os.path.join(job_scheduler_dir,'job_scheduler', 'job_scheduler.py'))



    yield context.spark
    context.spark.stop()  # Clean up after all scenarios

# Use the fixture in all scenarios
def before_all(context):
    use_fixture(spark_context, context)
    step_clean_db(context)


def before_scenario(context, scenario):
    step_clean_db(context)

def step_clean_db(context):
    context.spark.sql("""
        CREATE SCHEMA IF NOT EXISTS pv_test
    """)

    context.spark.sql("""
        CREATE TABLE IF NOT EXISTS pv_test.jobs (id STRING, name STRING, type STRING, query STRING, frequency STRING, query_output_table STRING) USING DELTA LOCATION '/data/pv_test/jobs'
    """)

    context.spark.sql("""
        CREATE TABLE IF NOT EXISTS pv_test.auth_groups (id STRING, name STRING, create_table BOOLEAN, 
            read_table BOOLEAN, 
            update_table BOOLEAN, 
            delete_table BOOLEAN, 
            create_dashboard BOOLEAN, 
            read_dashboard BOOLEAN, 
            update_dashboard BOOLEAN, 
            delete_dashboard BOOLEAN) USING DELTA LOCATION '/data/pv_test/auth_groups'
    """)


    context.spark.sql("""
        CREATE TABLE IF NOT EXISTS pv_test.jobs_status (
            id STRING NOT NULL,
            job_id STRING NOT NULL,
            last_run_time TIMESTAMP,
            status STRING NOT NULL
        ) USING DELTA LOCATION "/data/pv_test/jobs_status";
    """)

    context.spark.sql("""
        DELETE FROM pv_test.auth_groups
    """).toPandas()

    context.spark.sql("""
        DELETE FROM pv_test.jobs
    """)
    context.spark.sql("""
        DELETE FROM pv_test.jobs_status
    """)

    path = "/data/pv_test/jobs_outputs/foo-output"

    if DeltaTable.isDeltaTable(context.spark, path):
        context.spark.sql(f"DELETE FROM delta.`{path}`")
    else:
        print(f"⚠️ Table at {path} does not exist")


    context.spark.sql("""
        INSERT INTO pv_test.auth_groups (id, name, create_table, 
            read_table, 
            update_table, 
            delete_table, 
            create_dashboard, 
            read_dashboard, 
            update_dashboard, 
            delete_dashboard) 
            VALUES
            ('1', 'foo', true, true, true, true, true, true, true, true)
    """)



