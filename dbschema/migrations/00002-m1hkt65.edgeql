CREATE MIGRATION m1hkt65vr4wtgkpi7akhmnto6sngr5kg35c4yxofcqpymydyp2btnq
    ONTO m1i5hlrkdq5d2wfj5rwelem3ihmgjgbgowiii76srumilfop6vzf6a
{
  CREATE TYPE default::User {
      CREATE REQUIRED LINK identity: ext::auth::Identity;
  };
  CREATE GLOBAL default::current_user := (std::assert_single((SELECT
      default::User {
          id
      }
  FILTER
      (.identity = GLOBAL ext::auth::ClientTokenIdentity)
  )));
};
