require 'rails_helper'
require 'devise'

RSpec.describe "Admin", type: :request do
  describe "GET /dashboard" do
    it "Signed (Admin) User returns http success" do
      admin = create(:admin_user)
      sign_in admin

      get "/admin/dashboard"
      expect(response).to have_http_status(:success)
    end

    it "non-signed User should not returns http success" do
      get "/admin/dashboard"
      expect(response).not_to have_http_status(:success)
    end
  end
end
