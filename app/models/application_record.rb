class ApplicationRecord < ActiveRecord::Base
  primary_abstract_class
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
end
