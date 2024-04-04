export type Batch = string[];

export const MB = 1048576;

const BATCH_MAX_SIZE = 5*MB;

/**
 * Fuction that transforms an array of record to array of batches. Each array contain array of records.
 * @param records Array of records
 * @returns Array of batches
 */
export function processRecords(records: string[]): Batch[] {
    const result: Batch[] = [];
    let batchSize = 0;
    let batch: Batch = [];

    // A helper function that submits the current batch to the result and creates a new current batch.
    function submitBatch() {
        result.push(batch);
        batch = [];
        batchSize = 0;
    }

    // Let's process all records
    records.forEach(record => {
        // Get the size of the record in bytes. If the size is too big, ignore it.
        const size = Buffer.from(record).length;
        
        if (size > MB)
          return;

        // If the batch size in bytes would come too big, submit the current batch and start a new one.
        if (batchSize + size > BATCH_MAX_SIZE) {
            submitBatch();
        }

        // Add the record to the current batch
        batch.push(record);
        batchSize += size;

        // If we have reached the maximum element size of a batch, let's submit it and start a new one.
        if (batch.length === 500) {
            submitBatch();
        }
    });

    // All records processed. If the current batch contains any records, let's submit it.
    if (batch.length > 0) {
        submitBatch();
    }

    return result;
}