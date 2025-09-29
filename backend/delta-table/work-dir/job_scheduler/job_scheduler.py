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


@udf
def next_cron(cron_str, timestamp_now):
    print(f"next_cron(cron_str, timestamp_now): BEFORE PARSING STR {cron_str} {timestamp_now}")
    cron = Cron(cron_str)
    ts = datetime.fromisoformat(timestamp_now)
    schedule = cron.schedule(ts).next()
    return f"{schedule.isoformat()}"


class JobScheduler:
    def __init__(self, spark, prefix: str):
        self.spark = spark
        self.prefix = prefix
        self.spark.udf.register("next_cron", next_cron)

    def task(self, job_id: str, query: str, output_table: str):
        print(f"[{datetime.now().isoformat()}] Running job {job_id}")
        status = 'failed'
        
        # Record start time immediately
        start_time = datetime.now().replace(microsecond=0)
        
        # Insert started status
        self.spark.sql(f"""
            INSERT INTO pv_test.jobs_status (id, job_id, last_run_time, status) 
            VALUES ('{uuid.uuid4()}', '{job_id}', '{start_time}', 'started')
        """)
        
        try:
            print(f"PRINTING QUERY: {query}")
            df = self.spark.sql(query)          
            df.write.option("inferSchema", "true").mode('append').format('delta').save(output_table)
            status = "success"
        except Exception as e:
            print(f"Job {job_id} failed: {e}")

        # Record completion time
        end_time = datetime.now().replace(microsecond=0)
        
        print("BEFORE INSERTING JOB STATUS")
        self.spark.sql(f"""
            INSERT INTO pv_test.jobs_status (id, job_id, last_run_time, status) 
            VALUES ('{uuid.uuid4()}', '{job_id}', '{end_time}', '{status}')
        """)
        

    def run_single_job(self):
        now = datetime.now().replace(second=0, microsecond=0)
        jobs = self.spark.sql(f"""
            SELECT *, next_cron(frequency, '{now}') AS next 
            FROM pv_test.jobs
            WHERE next_cron(frequency, '{now}') = '{now.isoformat()}'
        """).collect()

        for job in jobs:
            t = threading.Thread(
                target=self.task,
                args=(job.id, job.query, job.query_output_table)
            )
            t.start()

            print(f"Job {job.id} ({job.name}) has started")

    
    def run_multiple_jobs(): # pragma: no cover
        while True:
            run_single_job()
        time.sleep(60) 

if __name__ == "__main__": # pragma: no cover
    print("Starting job scheduler")
    run_single_job()
