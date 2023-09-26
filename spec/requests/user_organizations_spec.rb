require 'rails_helper'
require 'devise'

RSpec.describe "UserOrganizations", type: :request do
  let(:valid_attributes) {
    user_id { 1 }
    organization_id { 1 }
  }

  let(:invalid_attributes) {
    user_id { nil }
    organization_id { nil }
  }

  describe "(Not logged in Admin) Should be redirect to sign_path" do
    before do
      @admin_user_1 = create(:admin_user)
      @user_org1 = create(:user_organization, organization: create(:organization, manager: @admin_user_1))
    end

    it "Redirect to Login URL" do
      get admin_organization_user_organizations_path(@user_org1.organization)
      assert_redirected_to new_user_session_url
    end
  end

  describe "(Logged Admin) GET Routes " do
    before do
      @admin_user_1 = create(:admin_user)
      @normal_user = create(:normal_user)
      @organization = create(:organization, manager: @admin_user_1)
      @user_org1 = create(:user_organization, organization: @organization, user: @normal_user)

      sign_in @admin_user_1
    end

    describe 'GET /new' do
      it "renders a successful response" do
        get new_admin_organization_user_organization_path(@organization)
        expect(response).to be_successful
      end
    end

    describe "GET /index" do
      it "renders a successful response" do
        get admin_organization_user_organizations_path(@organization)
        expect(response).to be_successful
      end
    end
  end

  describe "(Logged Admin) POST Routes" do
    before do
      @admin_user_1 = create(:admin_user)
      @normal_user = create(:normal_user)
      @organization = create(:organization, manager: @admin_user_1)
      @user_org1 = create(:user_organization, organization: @organization, user: @normal_user)

      sign_in @admin_user_1
    end

    describe "POST /create" do
      context "with valid parameters" do
        it "creates and redirect to the Index (UserOrganizations)" do
          expect{
            post admin_organization_user_organizations_path(@organization.id), params: {
              user_organization: {
                user_id: @normal_user.id,
                organization_id: @organization.id
              }
            }
          }.to change(UserOrganization, :count).by(1)

          expect(response).to redirect_to(admin_organization_user_organizations_path(@organization))
        end
      end

      context "with invalid parameters" do
        it "does not create a new UserOrganization" do
          expect{
            post admin_organization_user_organizations_path(@organization.id), params: {
              user_organization: {
                user_id: nil,
                organization_id: nil
              }
            }
          }.to change(UserOrganization, :count).by(0)
        end

        it "renders a response with 422 status (i.e. to display the 'new' template)" do
          post admin_organization_user_organizations_path(@organization.id), params: {
            user_organization: {
              user_id: nil,
              organization_id: nil
            }
          }
          expect(response).to have_http_status(:unprocessable_entity)
        end
      end
    end
  end

  describe "DELETE /destroy" do
    before do
      @admin_user_1 = create(:admin_user)
      @normal_user = create(:normal_user)
      @organization = create(:organization, manager: @admin_user_1)
      @user_org1 = create(:user_organization, organization: @organization, user: @normal_user)

      sign_in @admin_user_1
    end

    it "destroys the requested department" do
      assert_difference 'UserOrganization.count', -1 do
        delete admin_user_organization_path(@user_org1)
      end
    end

    it "redirects to the roles list" do
      assert_difference 'UserOrganization.count', -1 do
        delete admin_user_organization_path(@user_org1)
      end

      expect(response).to redirect_to(admin_organization_path(@organization.id))
    end
  end
end
