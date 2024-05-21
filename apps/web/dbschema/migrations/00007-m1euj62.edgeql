CREATE MIGRATION m1euj62qlmnqp6fjayuea667srl64vbppn3toxqngtg7lqaezg5kza
    ONTO m12vuk3gmeokm6fqauodbz7zurdac6shvp2yewerffptwfnu6fucfq
{
  ALTER TYPE default::ChatSession {
      CREATE PROPERTY created_at: std::datetime {
          CREATE REWRITE
              INSERT 
              USING (std::datetime_of_statement());
      };
  };
  ALTER TYPE default::Form {
      CREATE PROPERTY created_at: std::datetime {
          CREATE REWRITE
              INSERT 
              USING (std::datetime_of_statement());
      };
      CREATE PROPERTY updated_at: std::datetime {
          CREATE REWRITE
              UPDATE 
              USING (std::datetime_of_statement());
      };
  };
  ALTER TYPE default::FormVariable {
      CREATE PROPERTY created_at: std::datetime {
          CREATE REWRITE
              INSERT 
              USING (std::datetime_of_statement());
      };
      CREATE PROPERTY updated_at: std::datetime {
          CREATE REWRITE
              UPDATE 
              USING (std::datetime_of_statement());
      };
  };
  ALTER TYPE default::User {
      ALTER LINK identity {
          SET default := (GLOBAL ext::auth::ClientTokenIdentity);
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE PROPERTY email := (((SELECT
          ext::auth::EmailFactor {
              email
          }
      FILTER
          (ext::auth::EmailFactor.identity = default::User.identity)
      )).email);
  };
};
