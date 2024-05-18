CREATE MIGRATION m16ode6pweemzmj5eljlzp2m6lhuqmramfj5b4eevlcxafyakvwbga
    ONTO m1hkt65vr4wtgkpi7akhmnto6sngr5kg35c4yxofcqpymydyp2btnq
{
  ALTER TYPE default::Form {
      CREATE LINK user: default::User;
  };
};
