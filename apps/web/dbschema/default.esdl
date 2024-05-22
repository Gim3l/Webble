using extension auth;


module default {
  global current_user := (
    assert_single((
      select User { id }
      filter .identity = global ext::auth::ClientTokenIdentity
    ))
  );

  type User {
      required identity: ext::auth::Identity {
            default := global ext::auth::ClientTokenIdentity;
            constraint exclusive;
      };
      email := (
          select ext::auth::EmailFactor {email}
          filter ext::auth::EmailFactor.identity = User.identity
      ).email;
  }

  type Form {
    required name: str {
        constraint min_len_value(2);
    };
    required structure: json;
    required user: User;
    published: bool {
        default := false;
    };

    multi sessions := .<form[is ChatSession];
    multi variables := .<form[is FormVariable];

    created_at: datetime {
        rewrite insert using (datetime_of_statement())
    }
    updated_at: datetime {
        rewrite update using (datetime_of_statement())
    }
  }

  type FormVariable {
    required label: str {
        constraint min_len_value(2);
    };
    required form: Form {
        on target delete delete source;
    };


    constraint exclusive on ((.form, .label));

    created_at: datetime {
        rewrite insert using (datetime_of_statement())
    }
    updated_at: datetime {
        rewrite update using (datetime_of_statement())
    }
  }

  type ChatSession {
    state: json;
    form: Form {
        on target delete delete source;
    };
    snapshot: json;

    created_at: datetime {
        rewrite insert using (datetime_of_statement())
    }
  }
}
