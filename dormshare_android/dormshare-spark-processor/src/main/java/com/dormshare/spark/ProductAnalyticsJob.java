package com.dormshare.spark;

import org.apache.spark.sql.Dataset;
import org.apache.spark.sql.Row;
import org.apache.spark.sql.SparkSession;
import org.apache.spark.sql.streaming.StreamingQuery;
import org.apache.spark.sql.streaming.Trigger;
import static org.apache.spark.sql.functions.*;

public class ProductAnalyticsJob {
    public static void main(String[] args) throws Exception {
        SparkSession spark = SparkSession.builder()
                .appName("DormShareProductAnalytics")
                .master("local[*]")
                .config("spark.mongodb.output.uri", "mongodb://localhost:27017/dormshare.analytics")
                .getOrCreate();

        // 1. Read from Kafka
        Dataset<Row> kafkaStream = spark.readStream()
                .format("kafka")
                .option("kafka.bootstrap.servers", "localhost:9092")
                .option("subscribe", "handoff-events")
                .load();

        // 2. Transorm JSON data
        Dataset<Row> transactions = kafkaStream.selectExpr("CAST(value AS STRING)")
                .select(from_json(col("value"), schema_of_json("{\"itemId\":\"\",\"status\":\"\"}")).as("data"))
                .select("data.*");

        // 3. Perform Analytics: Track popularity of items
        Dataset<Row> itemPopularity = transactions.groupBy("itemId")
                .count()
                .withColumn("timestamp", current_timestamp());

        // 4. Sink to MongoDB
        StreamingQuery query = itemPopularity.writeStream()
                .format("mongodb")
                .option("checkpointLocation", "/tmp/spark_checkpoints")
                .option("forceDeleteTempCheckpointLocation", "true")
                .outputMode("complete")
                .trigger(Trigger.ProcessingTime("10 seconds"))
                .start();

        query.awaitTermination();
    }
}
