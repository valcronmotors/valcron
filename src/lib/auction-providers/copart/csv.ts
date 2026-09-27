import { COPART_CSV_HEADERS } from "./schema";

export type CsvParseIssue = {
  line: number;
  reason: string;
};

export const COPART_CSV_FIELD_EXPLOSION_CHARS = 10_000;

type ParserState = {
  field: string;
  row: string[];
  quoted: boolean;
  records: string[][];
  line: number;
};

function createState(): ParserState {
  return { field: "", row: [], quoted: false, records: [], line: 1 };
}

function endField(state: ParserState) {
  state.row.push(state.field);
  state.field = "";
}

function endRow(state: ParserState) {
  endField(state);
  const meaningful = state.row.some((value) => value.length > 0);
  if (meaningful) {
    state.records.push(state.row);
  }
  state.row = [];
  state.line += 1;
}

function consumeChar(state: ParserState, char: string, next: string | undefined) {
  if (state.quoted) {
    if (char === '"') {
      if (next === '"') {
        state.field += '"';
        return 1;
      }
      state.quoted = false;
      return 0;
    }
    state.field += char;
    if (char === "\n") state.line += 1;
    return 0;
  }

  if (char === '"') {
    state.quoted = true;
    return 0;
  }
  if (char === ",") {
    endField(state);
    return 0;
  }
  if (char === "\n") {
    endRow(state);
    return 0;
  }
  if (char === "\r") {
    if (next === "\n") return 0;
    endRow(state);
    return 0;
  }
  state.field += char;
  return 0;
}

export function parseCsvRecords(text: string): string[][] {
  const state = createState();
  for (let i = 0; i < text.length; i += 1) {
    i += consumeChar(state, text[i]!, text[i + 1]);
  }
  if (state.quoted) {
    endRow(state);
    return state.records;
  }
  if (state.field.length > 0 || state.row.length > 0) {
    endRow(state);
  }
  return state.records;
}

export async function streamCsvRecords(
  source: AsyncIterable<string>,
  onRecord: (record: string[], line: number) => void | Promise<void>,
) {
  const state = createState();
  state.records = [];

  async function flushRecord() {
    if (state.records.length === 0) return;
    const record = state.records.shift();
    if (!record) return;
    await onRecord(record, state.line - 1);
  }

  for await (const chunk of source) {
    for (let i = 0; i < chunk.length; i += 1) {
      i += consumeChar(state, chunk[i]!, chunk[i + 1]);
      while (state.records.length > 0) {
        await flushRecord();
      }
    }
  }

  if (state.field.length > 0 || state.row.length > 0) {
    endRow(state);
    while (state.records.length > 0) {
      await flushRecord();
    }
  }
}

export function csvRowLooksMalformed(headers: string[], values: string[]) {
  if (values.length === 0) return "empty";
  if (values.length < Math.max(8, Math.floor(headers.length * 0.5))) return "too_few_columns";
  if (values.some((value) => value.length > COPART_CSV_FIELD_EXPLOSION_CHARS)) return "field_explosion";
  return null;
}

export function csvEscape(value: string) {
  if (/[",\r\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function serializeCopartCsv(rows: Array<Partial<Record<string, string>>>) {
  const lines = [
    COPART_CSV_HEADERS.map(csvEscape).join(","),
    ...rows.map((row) => COPART_CSV_HEADERS.map((header) => csvEscape(row[header] ?? "")).join(",")),
  ];
  return `${lines.join("\r\n")}\r\n`;
}
