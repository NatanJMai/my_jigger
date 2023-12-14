FactoryBot.define do
  factory :user_organization, class: "UserOrganization" do
    user { association :normal_user }
    organization { association :organization }
  end
end
