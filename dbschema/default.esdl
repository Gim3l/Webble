using extension auth;

module default {
  type Form {
    required name: str;
    required structure: json;
    multi sessions := .<form[is ChatSession];
  }

  type ChatSession {
    state: json;
    form: Form;
    snapshot: json;
  }
}
