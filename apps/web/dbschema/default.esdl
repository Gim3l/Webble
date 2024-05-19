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
    required name: str {
        constraint min_len_value(2);
    };
    required structure: json;
    required user: User;

    multi sessions := .<form[is ChatSession];
    multi variables := .<form[is FormVariable];
  }

  type FormVariable {
    required label: str {
        constraint min_len_value(2);
    };
    required form: Form;

    constraint exclusive on ((.form, .label));
  }

  type ChatSession {
    state: json;
    form: Form;
    snapshot: json;
  }
}
