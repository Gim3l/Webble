CREATE MIGRATION m1mlajagtj7l56ynokdovlkxhrwcpl6zatkwat5jfcpviu7iinqanq
    ONTO m1cxjzhpcvoue56l4ileadff5iw4ctl55sqy3aem2exlf6cgm4ygyq
{
  ALTER TYPE default::Form {
      CREATE PROPERTY color: std::str;
  };
  ALTER TYPE default::Form {
      DROP PROPERTY structure;
  };
};
