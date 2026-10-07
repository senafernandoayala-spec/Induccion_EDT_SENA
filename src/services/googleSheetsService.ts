export interface ApprenticeInductionRecord {
  timestamp: string;
  fullName: string;
  documentType: string;
  documentNumber: string;
  cohortNumber: string;
  programName: string;
  trainingCenter: string;
  regional: string;
  scorePercent: number;
  evaluationResult: string; // 'APROBADO (A)'
  certificateCode: string;
  gamifiedScore?: number;
  timeFormatted?: string;
  maxStreak?: number;
}

export interface GoogleSpreadsheetInfo {
  id: string;
  title: string;
  url: string;
}

const SPREADSHEET_TITLE = 'Registro Inducción Aprendices SENA';
const SHEET_TAB_NAME = 'Aprendices Inducidos';

const HEADERS = [
  'Fecha y Hora',
  'Nombre Completo',
  'Tipo Documento',
  'Número Documento',
  'Número de Ficha',
  'Programa de Formación',
  'Centro de Formación',
  'Regional',
  'Puntaje Obtenido',
  'Juicio Evaluativo',
  'Código de Certificado',
  'Puntaje Gamificado',
  'Tiempo Empleado',
  'Racha Máxima',
];

/**
 * Searches for an existing spreadsheet named "Registro Inducción Aprendices SENA" in the user's Drive,
 * or creates a new one with official institutional formatting.
 */
export async function getOrCreateInductionSpreadsheet(
  accessToken: string
): Promise<GoogleSpreadsheetInfo> {
  // 1. Search in Drive
  const query = encodeURIComponent(
    `name = '${SPREADSHEET_TITLE}' and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false`
  );
  const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,webViewLink)`;

  const searchRes = await fetch(searchUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!searchRes.ok) {
    const errorText = await searchRes.text();
    console.error('Error buscando hoja de cálculo en Drive:', errorText);
    throw new Error('No se pudo verificar la existencia del archivo en Google Drive');
  }

  const searchData = await searchRes.json();
  if (searchData.files && searchData.files.length > 0) {
    const file = searchData.files[0];
    return {
      id: file.id,
      title: file.name,
      url: file.webViewLink || `https://docs.google.com/spreadsheets/d/${file.id}/edit`,
    };
  }

  // 2. Create new Spreadsheet if not found
  const createUrl = 'https://sheets.googleapis.com/v4/spreadsheets';
  const createBody = {
    properties: {
      title: SPREADSHEET_TITLE,
    },
    sheets: [
      {
        properties: {
          title: SHEET_TAB_NAME,
          gridProperties: {
            frozenRowCount: 1,
          },
        },
      },
    ],
  };

  const createRes = await fetch(createUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(createBody),
  });

  if (!createRes.ok) {
    const errorText = await createRes.text();
    console.error('Error creando hoja de cálculo en Google Sheets:', errorText);
    throw new Error('Error al crear la hoja de cálculo en Google Drive');
  }

  const newSheet = await createRes.json();
  const spreadsheetId = newSheet.spreadsheetId;

  // 3. Insert Header Row
  const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
    SHEET_TAB_NAME
  )}!A1:append?valueInputOption=USER_ENTERED`;

  await fetch(appendUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: [HEADERS],
    }),
  });

  return {
    id: spreadsheetId,
    title: SPREADSHEET_TITLE,
    url: newSheet.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
  };
}

/**
 * Appends a new apprentice induction record to the spreadsheet.
 */
export async function appendApprenticeRecordToSheet(
  accessToken: string,
  spreadsheetId: string,
  record: ApprenticeInductionRecord
): Promise<void> {
  const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
    SHEET_TAB_NAME
  )}!A:N:append?valueInputOption=USER_ENTERED`;

  const row = [
    record.timestamp,
    record.fullName,
    record.documentType,
    record.documentNumber,
    record.cohortNumber,
    record.programName,
    record.trainingCenter,
    record.regional,
    `${record.scorePercent}%`,
    record.evaluationResult,
    record.certificateCode,
    record.gamifiedScore !== undefined ? `${record.gamifiedScore} pts` : 'N/A',
    record.timeFormatted || 'N/A',
    record.maxStreak !== undefined ? `${record.maxStreak} seguidos` : 'N/A',
  ];

  const res = await fetch(appendUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: [row],
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Error agregando registro de aprendiz en Google Sheets:', errorText);
    throw new Error('No se pudo agregar el registro en la hoja de cálculo');
  }
}

/**
 * Fetches existing rows to display live induction records from the spreadsheet.
 */
export async function fetchInductionSheetRows(
  accessToken: string,
  spreadsheetId: string
): Promise<{ headers: string[]; rows: string[][] }> {
  const readUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
    SHEET_TAB_NAME
  )}!A1:K100`;

  const res = await fetch(readUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    return { headers: HEADERS, rows: [] };
  }

  const data = await res.json();
  const values: string[][] = data.values || [];

  if (values.length === 0) {
    return { headers: HEADERS, rows: [] };
  }

  const [headerRow, ...dataRows] = values;
  return {
    headers: headerRow || HEADERS,
    rows: dataRows || [],
  };
}
