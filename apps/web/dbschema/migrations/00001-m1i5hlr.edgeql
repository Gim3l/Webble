CREATE MIGRATION m1i5hlrkdq5d2wfj5rwelem3ihmgjgbgowiii76srumilfop6vzf6a
    ONTO initial
{
  CREATE EXTENSION pgcrypto VERSION '1.3';
  CREATE EXTENSION auth VERSION '1.0';
  CREATE TYPE default::ChatSession {
      CREATE PROPERTY snapshot: std::json;
      CREATE PROPERTY state: std::json;
  };
  CREATE TYPE default::Form {
      CREATE REQUIRED PROPERTY name: std::str;
      CREATE REQUIRED PROPERTY structure: std::json;
  };
  ALTER TYPE default::ChatSession {
      CREATE LINK form: default::Form;
  };
  ALTER TYPE default::Form {
      CREATE MULTI LINK sessions := (.<form[IS default::ChatSession]);
  };
};
