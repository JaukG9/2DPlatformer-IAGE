import java.io.*;
import java.util.*;

public class CSVProcessor {

    public static void main(String[] args) {
        String inputFile = "IAGEData.csv";
        String outputFile = "Processed_IAGEData.csv";

        // Key = 2nd column, Value = full row
        Map<String, String[]> dataMap = new LinkedHashMap<>(); // keeps order

        // ===== READ CSV =====
        try (BufferedReader br = new BufferedReader(new FileReader(inputFile))) {
            String line;

            while ((line = br.readLine()) != null) {
                String[] values = line.split(",");

                if (values.length >= 2) {
                    String key = values[1]; // 2nd column

                    // Ensure exactly 36 columns
                    if (values.length < 36) {
                        values = Arrays.copyOf(values, 36);
                    }

                    // Override if duplicate key
                    dataMap.put(key, values);
                }
            }

        } catch (IOException e) {
            e.printStackTrace();
        }

        // ===== WRITE NEW CSV =====
        try (BufferedWriter bw = new BufferedWriter(new FileWriter(outputFile))) {

            for (String[] row : dataMap.values()) {
                // Convert array back to CSV line
                String line = String.join(",", sanitize(row));
                bw.write(line);
                bw.newLine();
            }

            System.out.println("Processed CSV written to: " + outputFile);

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // ===== OPTIONAL: Clean nulls to avoid "null" text in CSV =====
    private static String[] sanitize(String[] row) {
        String[] clean = new String[row.length];
        for (int i = 0; i < row.length; i++) {
            clean[i] = (row[i] == null) ? "" : row[i];
        }
        return clean;
    }
}