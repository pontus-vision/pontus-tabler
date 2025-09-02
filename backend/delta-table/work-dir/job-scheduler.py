from pyspark.sql.functions import udf
from pyspark.sql.types import IntegerType, StringType
from datetime import datetime
import time
from cron_converter import Cron
import uuid
import queue
import threading
from pyspark.sql import SparkSession
from pyspark.conf import SparkConf

print("BEFORE SPARK CONF")

conf = SparkConf() \
    .setAppName("job-scheduler") \
    .setMaster("local[*]") \
    .set("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension") \
    .set("spark.sql.catalog.spark_catalog", "org.apache.spark.sql.delta.catalog.DeltaCatalog")

print("BEFORE SPARK")

spark = SparkSession.builder.config(conf=conf).getOrCreate()

# spark._sc.setLogLevel("INFO")

# spark = SparkSession.builder \
#     .appName("JobScheduler") \

#     .getOrCreate()




# slen = udf(lambda s: len(s), IntegerType())

print("BEFORE NEXT CRON DEFININTON")

@udf
def next_cron(cron_str, timestamp_now):
    print(f"next_cron(cron_str, timestamp_now): BEFORE PARSING STR {cron_str} {timestamp_now}")
    cron = Cron(cron_str)
    ts = datetime.fromisoformat(timestamp_now)
    print(ts)
    schedule = cron.schedule(ts).next()
    return schedule.isoformat()

print("BEFORE NOW")
now = datetime.now().replace(second=0, microsecond=0)
# next_cron('*/5 * * * *', f'{now}')
# spark.udf.register("to_upper", to_upper)
print("BEFORE REGISTERING NEXT CRON")
spark.udf.register("next_cron", next_cron)
# df = spark.createDataFrame([(1, "John Doe", 21)], ("id", "name", "age"))
# df.select(slen("name").alias("slen(name)"), to_upper("name"), add_one("age")).show()
print("BEFORE RUNNING SPARK SQL 0")

spark.sql("""
CREATE SCHEMA IF NOT EXISTS pv_test
""")

print("BEFORE RUNNING SPARK SQL 1")
spark.sql("""
CREATE TABLE IF NOT EXISTS pv_test.jobs (id STRING, name STRING, type STRING, query STRING, frequency STRING) USING DELTA LOCATION '/data/pv_test/jobs'
""")
print("BEFORE RUNNING SPARK SQL 2")
spark.sql("""
CREATE TABLE IF NOT EXISTS pv_test.auth_groups (id STRING, name STRING, create_table BOOLEAN, 
    read_table BOOLEAN, 
    update_table BOOLEAN, 
    delete_table BOOLEAN, 
    create_dashboard BOOLEAN, 
    read_dashboard BOOLEAN, 
    update_dashboard BOOLEAN, 
    delete_dashboard BOOLEAN) USING DELTA LOCATION '/data/pv_test/auth_groups'
""")
print("BEFORE RUNNING SPARK SQL 3")
spark.sql("""
CREATE TABLE IF NOT EXISTS pv_test.jobs_status (
    id STRING NOT NULL,
    job_id STRING NOT NULL,
    last_run_time TIMESTAMP NOT NULL,
    status STRING NOT NULL
) USING DELTA LOCATION "/data/pv_test/jobs_status";
""")
print("BEFORE RUNNING SPARK SQL 4")

spark.sql("""
DELETE FROM pv_test.jobs
""").toPandas()

print("BEFORE RUNNING SPARK SQL 5")
spark.sql("""
DELETE FROM pv_test.jobs_status
""").toPandas()
print("BEFORE RUNNING SPARK SQL 6")
uid1 = uuid.uuid4()
uid2 = uuid.uuid4()
print("BEFORE RUNNING SPARK SQL 7")
spark.sql(f"""
INSERT INTO pv_test.jobs (id, name, type, query, frequency) VALUES (
    '{uid1}', 
    'foo2', 
    'bar2',
    'SELECT * FROM pv_test.auth_groups',
    '* * * * *'
)
""")
print("BEFORE RUNNING SPARK SQL 8")
spark.sql(f"""
INSERT INTO pv_test.jobs_status (id, job_id, last_run_time, status) VALUES (
    '{uid2}', 
    '{uid1}', 
    '{now}',
    'active'
)
""")


print("BEFORE RUNNING SPARK SQL 9")


# pv_test_jobs = spark.sql(f"""
# SELECT *, next_cron(frequency, '{now}') AS next FROM pv_test.jobs 
# WHERE next_cron(frequency, '{now}') = '{now.isoformat()}'
# """)

# print(f"JOBS: \n{pv_test_jobs} \n\n JOBS_STATUS: \n{pv_test_jobs_status}")




# while True:
#     now = datetime.now().replace(second=0, microsecond=0)  # round to minute

#     for job in jobs:
#         cron = Cron(job["cron"])
#         schedule = cron.schedule(now).next()
        

#         print(f"Now: {now}, Job: {job}, schedule: {schedule}")
#         if schedule <= now:
#             print(f'Run job {job["name"]}')

#     time.sleep(60)  
    



def task(job_id, query):
    print(f"[{datetime.now().isoformat()}] Running job {job_id}")
    try:
        print(f"PRINTING QUERY: {query}")
        df = spark.sql(query)          
        df.show()
        status = "success"
    except Exception as e:
        print(f"Job {job_id} failed: {e}")
        status = "failed"

    spark.sql(f"""
        INSERT INTO pv_test.jobs_status (id, job_id, last_run_time, status) 
        VALUES ('{uuid.uuid4()}', '{job_id}', '{datetime.now().replace(microsecond=0)}', '{status}')
    """)

def run_multiple_jobs():
    while True:
        print("run_multiple_jobs(): INSIDE MULTIPLE JOBS")
        now = datetime.now().replace(second=0, microsecond=0)
        print("run_multiple_jobs(): BEFORE RUNING SQL")
        jobs = spark.sql(f"""
            SELECT *, next_cron(frequency, '{now}') AS next 
            FROM pv_test.jobs
            WHERE next_cron(frequency, '{now}') = '{now.isoformat()}'
        """).collect()
        print(f"PRINTING JOBS: {jobs}")
        for job in jobs:
            t = threading.Thread(
                target=task,             
                args=(job.id, job.query)   
            )
            t.start()

            print(f"Job {job.id} ({job.name}) has started")

        time.sleep(60) 


# if __name__ == "__main__":
print("Starting job scheduler")
run_multiple_jobs()
