CREATE MIGRATION m1et3eu7hv7k4eoqjxfek7npt7minic33fq2abpqcps2leoiw7yvoa
    ONTO m1hotll32744tsbad6mdygkxthsvjnanw2gakckfqvp6lhe5gipzfa
{
  ALTER TYPE default::Image {
      CREATE ACCESS POLICY has_access_to_form
          ALLOW ALL USING ((GLOBAL default::current_user ?= .form.user)) {
              SET errmessage := 'User does not have access to form';
          };
  };
};
