using extension auth;

module default {
  global current_user := (
    assert_single((
      select User { id }
      filter .identity = global ext::auth::ClientTokenIdentity
    ))
  );

  type User {
      required identity: ext::auth::Identity;
  }

  type Form {
    required name: str;
    required structure: json;
    multi sessions := .<form[is ChatSession];
    user: User;
  }

  type ChatSession {
    state: json;
    form: Form;
    snapshot: json;
  }
}
