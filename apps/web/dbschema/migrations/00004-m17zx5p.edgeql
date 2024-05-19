CREATE MIGRATION m17zx5pcl2hpmpebvt5oqdisre3zc7sec2j6nyrqsetavfngkltwta
    ONTO m16ode6pweemzmj5eljlzp2m6lhuqmramfj5b4eevlcxafyakvwbga
{
  ALTER TYPE default::Form {
      ALTER LINK user {
          SET REQUIRED USING (<default::User>{});
      };
  };
  CREATE TYPE default::FormVariable {
      CREATE REQUIRED LINK form: default::Form;
      CREATE REQUIRED PROPERTY label: std::str;
  };
  ALTER TYPE default::Form {
      CREATE MULTI LINK variables := (.<form[IS default::FormVariable]);
      ALTER PROPERTY name {
          CREATE CONSTRAINT std::min_len_value(2);
      };
  };
};
