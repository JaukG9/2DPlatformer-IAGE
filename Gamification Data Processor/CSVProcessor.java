import java.io.*;
import java.util.*;

public class CSVProcessor {
    public static void main(String[] args) {
        String inputFile = "IAGEData.csv";
        String outputFile = "Processed_IAGEData.csv";

        // Key = 2nd column, Value = full row
        Map<String, String[]> dataMap = new LinkedHashMap<>();

        String[] iageHeader = null;

        // ===== READ IAGE CSV =====
        try (BufferedReader br = new BufferedReader(new FileReader(inputFile))) {
            String line;

            // Read header first
            if ((line = br.readLine()) != null) {
                iageHeader = line.split(",");
            }

            while ((line = br.readLine()) != null) {
                String[] values = line.split(",");

                if (values.length >= 2) {
                    String key = values[1];

                    if (values.length < 36) {
                        values = Arrays.copyOf(values, 36);
                    }

                    dataMap.put(key, values);
                }
            }

        } catch (IOException e) {
            e.printStackTrace();
        }

        // ===== WRITE PROCESSED IAGE CSV =====
        try (BufferedWriter bw = new BufferedWriter(new FileWriter(outputFile))) {

            // Write header first
            if (iageHeader != null) {
                bw.write(String.join(",", sanitize(iageHeader)));
                bw.newLine();
            }

            for (String[] row : dataMap.values()) {
                bw.write(String.join(",", sanitize(row)));
                bw.newLine();
            }

            System.out.println("Processed CSV written to: " + outputFile);

        } catch (IOException e) {
            e.printStackTrace();
        }

        // ===== JOIN WITH surveyResponses.csv =====
        String surveyFile = "surveyResponses.csv";
        String combinedOutput = "Combined_Data.csv";

        try (
            BufferedReader br = new BufferedReader(new FileReader(surveyFile));
            BufferedWriter bw = new BufferedWriter(new FileWriter(combinedOutput))
        ) {
            String line;

            // ===== READ SURVEY HEADER =====
            String[] surveyHeader = null;
            if ((line = br.readLine()) != null) {
                surveyHeader = line.split(",");
            }

            // ===== WRITE COMBINED HEADER =====
            if (surveyHeader != null && iageHeader != null) {
                String[] combinedHeader = new String[surveyHeader.length + iageHeader.length];

                System.arraycopy(surveyHeader, 0, combinedHeader, 0, surveyHeader.length);
                System.arraycopy(iageHeader, 0, combinedHeader, surveyHeader.length, iageHeader.length);

                bw.write(String.join(",", sanitize(combinedHeader)));
                bw.newLine();
            }

            // ===== PROCESS DATA ROWS =====
            while ((line = br.readLine()) != null) {
                String[] surveyRow = line.split(",");

                if (surveyRow.length >= 7) {
                    String key = surveyRow[6];

                    if (dataMap.containsKey(key)) {
                        String[] iageRow = dataMap.get(key);

                        String[] combinedRow = new String[surveyRow.length + iageRow.length];

                        System.arraycopy(surveyRow, 0, combinedRow, 0, surveyRow.length);
                        System.arraycopy(iageRow, 0, combinedRow, surveyRow.length, iageRow.length);

                        bw.write(String.join(",", sanitize(combinedRow)));
                        bw.newLine();
                    }
                }
            }

            System.out.println("Combined CSV written to: " + combinedOutput);

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // ===== Clean nulls =====
    private static String[] sanitize(String[] row) {
        String[] clean = new String[row.length];
        for (int i = 0; i < row.length; i++) {
            clean[i] = (row[i] == null) ? "" : row[i];
        }
        return clean;
    }
}