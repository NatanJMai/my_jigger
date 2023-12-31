require 'rails_helper'
require 'devise'

# This spec was generated by rspec-rails when you ran the scaffold generator.
# It demonstrates how one might use RSpec to test the controller code that
# was generated by Rails when you ran the scaffold generator.
#
# It assumes that the implementation code is generated by the rails scaffold
# generator. If you are using any extension libraries to generate different
# controller code, this generated spec may or may not pass.
#
# It only uses APIs available in rails and/or rspec-rails. There are a number
# of tools you can use to make these specs even more expressive, but we're
# sticking to rails and rspec-rails APIs to keep things simple and stable.

RSpec.describe "/departments", type: :request do

  describe "(Not logged in Admin) Should be redirect to sign_path" do
    before do
      @admin_user_1  = create(:admin_user)
      @organization1 = create(:organization, manager: @admin_user_1)
    end

    it "Redirect to Login URL" do
      get new_admin_organization_department_path(@organization1)
      assert_redirected_to new_user_session_url
    end
  end

  describe "(Logged Admin) GET Routes " do
    before do
      @admin_user_1  = create(:admin_user)
      @organization1 = create(:organization, manager: @admin_user_1)
      @department1   = create(:department, :organization => @organization1)

      sign_in @admin_user_1
    end

    describe 'GET /new' do
      it "renders a successful response" do
        get new_admin_organization_department_path(@organization1)
        expect(response).to be_successful
      end
    end

    describe "GET /show" do
      it "renders a successful response" do
        get admin_department_path(@department1)
        expect(response).to be_successful
      end
    end

    describe "GET /index" do
      it "renders a successful response" do
        get admin_organization_departments_path(@organization1)
        expect(response).to be_successful
      end
    end

    describe "GET /edit" do
      it "renders a successful response" do
        get edit_admin_department_path(@department1)
        expect(response).to be_successful
      end
    end
  end

  describe "(Logged Admin) POST Routes" do
    before do
      @admin_user_1  = create(:admin_user)
      @organization1 = create(:organization, manager: @admin_user_1)
      @department1   = create(:department, :organization => @organization1)

      sign_in @admin_user_1
    end

    describe "POST /create" do
      context "with valid parameters" do
        it "creates and redirect to the new Department" do
          expect {
            post admin_organization_departments_path(@organization1.id), params: {
              department: {
                name: "Name",
                description: "Description",
                organization_id: @organization1.id,
                status: true
              }
            }
          }.to change(Department, :count).by(1)

          expect(response).to redirect_to(admin_department_path(Department.last))
        end
      end

      context "with invalid parameters" do
        it "does not create a new Department" do
          expect {
            post admin_organization_departments_path(@organization1), params: {
              department: {
                name: "",
                description: "",
                status: true
              }
            }
          }.to change(Department, :count).by(0)
        end

        it "renders a response with 422 status (i.e. to display the 'new' template)" do
          post admin_organization_departments_path(@organization1), params: {
            department: {
              name: "",
              description: "",
              status: true
            }
          }
          expect(response).to have_http_status(:unprocessable_entity)
        end
      end
    end
  end

  describe "PATCH /update" do
    before do
      @admin_user_1  = create(:admin_user)
      @organization1 = create(:organization, manager: @admin_user_1)
      @department1   = create(:department, :organization => @organization1)

      sign_in @admin_user_1
    end

    context "with valid parameters" do
      it "updates the requested department" do
        patch admin_department_path(@department1.id), params: {
          department: {
            name: "New Name",
            description: "New Description",
            organization_id: @organization1.id,
            status: true
          }
        }

        @department1.reload
        expect(response).to redirect_to(admin_department_path(@department1.id))
      end
    end

    context "with invalid parameters" do
      it "renders a response with 422 status (i.e. to display the 'edit' template)" do
        patch admin_department_path(@department1.id), params: {
          department: {
            name: "",
            description: "",
            status: true
          }
        }

        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe "DELETE /destroy" do
    before do
      @admin_user_1  = create(:admin_user)
      @organization1 = create(:organization, manager: @admin_user_1)
      @department1   = create(:department, :organization => @organization1)

      sign_in @admin_user_1
    end

    it "destroys the requested department" do
      assert_difference 'Department.count', -1 do
        delete admin_department_url(@department1)
      end
    end

    it "redirects to the departments list" do
      assert_difference 'Department.count', -1 do
        delete admin_department_url(@department1)
      end

      expect(response).to redirect_to(admin_organization_departments_url(@organization1.id))
    end
  end
end

