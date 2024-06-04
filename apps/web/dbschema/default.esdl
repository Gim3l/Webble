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
    color: str;
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
    form: Form {
        on target delete delete source;
    };
    values: json;
    history := .<session[is ChatHistory];

    created_at: datetime {
        rewrite insert using (datetime_of_statement())
    }
  }

  type ChatHistory {
    required session: ChatSession {
        on target delete delete source;
    };
    captures: json;
    message: str;
    created_at: datetime {
            rewrite insert using (datetime_of_statement())
    }
  }

  type Image {
    required key: str;
    required form: Form;
    created_at: datetime {
        rewrite insert using (datetime_of_statement())
    }

    access policy has_access_to_form
      allow all
        using (global current_user ?= .form.user) {
            errmessage := "User does not have access to form";
        }
  }
}
