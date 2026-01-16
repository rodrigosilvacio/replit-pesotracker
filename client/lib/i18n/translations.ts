export type Language = "pt" | "en";

export interface Translations {
  app: {
    title: string;
  };
  summary: {
    current: string;
    change: string;
    lowest: string;
    highest: string;
    kg: string;
  };
  form: {
    addWeight: string;
    editRecord: string;
    date: string;
    weight: string;
    addRecord: string;
    update: string;
    cancel: string;
    validWeight: string;
    weightRange: string;
  };
  chart: {
    title: string;
    noData: string;
    noDataDescription: string;
  };
  table: {
    title: string;
    date: string;
    weight: string;
    diff: string;
    actions: string;
    noEntries: string;
    noEntriesDescription: string;
  };
  deleteModal: {
    title: string;
    message: string;
    cancel: string;
    delete: string;
  };
  loading: {
    loadingData: string;
  };
  errors: {
    duplicateDate: string;
    saveFailed: string;
  };
  settings: {
    language: string;
    portuguese: string;
    english: string;
  };
}

export const translations: Record<Language, Translations> = {
  pt: {
    app: {
      title: "Peso Tracker",
    },
    summary: {
      current: "Atual",
      change: "Variação",
      lowest: "Menor",
      highest: "Maior",
      kg: "kg",
    },
    form: {
      addWeight: "Adicionar Peso",
      editRecord: "Editar Registro",
      date: "Data",
      weight: "Peso",
      addRecord: "Adicionar",
      update: "Atualizar",
      cancel: "Cancelar",
      validWeight: "Digite um peso válido",
      weightRange: "O peso deve ser entre 0 e 500 kg",
    },
    chart: {
      title: "Evolução do Peso",
      noData: "Sem dados ainda",
      noDataDescription: "Adicione seu primeiro registro para ver o gráfico de progresso",
    },
    table: {
      title: "Histórico de Peso",
      date: "Data",
      weight: "Peso",
      diff: "Dif",
      actions: "Ações",
      noEntries: "Nenhum registro",
      noEntriesDescription: "Comece a registrar seu peso hoje",
    },
    deleteModal: {
      title: "Excluir Registro?",
      message: "Tem certeza que deseja excluir este registro de peso? Esta ação não pode ser desfeita.",
      cancel: "Cancelar",
      delete: "Excluir",
    },
    loading: {
      loadingData: "Carregando seus dados de peso...",
    },
    errors: {
      duplicateDate: "Já existe um registro para esta data",
      saveFailed: "Falha ao salvar registro de peso",
    },
    settings: {
      language: "Idioma",
      portuguese: "Português",
      english: "English",
    },
  },
  en: {
    app: {
      title: "Weight Tracker",
    },
    summary: {
      current: "Current",
      change: "Change",
      lowest: "Lowest",
      highest: "Highest",
      kg: "kg",
    },
    form: {
      addWeight: "Add Weight",
      editRecord: "Edit Record",
      date: "Date",
      weight: "Weight",
      addRecord: "Add Record",
      update: "Update",
      cancel: "Cancel",
      validWeight: "Please enter a valid weight",
      weightRange: "Weight must be between 0 and 500 kg",
    },
    chart: {
      title: "Weight Evolution",
      noData: "No data yet",
      noDataDescription: "Add your first weight entry to see your progress chart",
    },
    table: {
      title: "Weight History",
      date: "Date",
      weight: "Weight",
      diff: "Diff",
      actions: "Actions",
      noEntries: "No entries yet",
      noEntriesDescription: "Start tracking your weight today",
    },
    deleteModal: {
      title: "Delete Record?",
      message: "Are you sure you want to delete this weight record? This action cannot be undone.",
      cancel: "Cancel",
      delete: "Delete",
    },
    loading: {
      loadingData: "Loading your weight data...",
    },
    errors: {
      duplicateDate: "A weight record already exists for this date",
      saveFailed: "Failed to save weight record",
    },
    settings: {
      language: "Language",
      portuguese: "Português",
      english: "English",
    },
  },
};
