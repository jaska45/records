import { MB, processRecords } from "./records";

describe('processRecords', () => {
    it('no records', () => {
      const INPUT = [];
      const output = processRecords(INPUT);
      expect(output).toEqual([]);
    });

    it('only few records that fix into one batch', () => {
      const INPUT = ['one', 'two', 'three'];
      const output = processRecords(INPUT);
      expect(output).toEqual([INPUT]);
    });

    it('larger than 1MB records should be ignored', () => {
      const INPUT = ['one', 't'.repeat(MB + 1), 'three'];
      const output = processRecords(INPUT);

      // The batch should have only two record because one was discarded
      expect(output[0].length).toEqual(2);
    });

    describe('returns multiple batches', () => {
      it('because maximun batch size exceeded', () => {
        const INPUT = [
          'a'.repeat(MB), 
          'b'.repeat(MB), 
          'cccc', 
          'd'.repeat(MB / 2), 
          'e'.repeat(MB / 3), 
          'f'.repeat(MB), 
          'f'.repeat(MB), 
          'f'.repeat(MB), 
          'ggg', 
          'h'.repeat(MB), 
          'iii'
        ];
        
        const output = processRecords(INPUT);

        // Should have two batches
        expect(output.length).toEqual(2);
      });

      it('because maximun record size exceeded', () => {
        // Create an input that contains 600 records
        const input = [];

        for (let i = 0; i < 600; i++) {
          input.push('value');
        }

        const output = processRecords(input);

        // Should have two batchs: 500 and 100 records
        expect(output.length).toEqual(2);
        expect(output[0].length).toEqual(500);
        expect(output[1].length).toEqual(100);
      });
    });
});
