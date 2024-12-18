class Admin::DatasheetsController < AdminController
  load_and_authorize_resource :item
  before_action :set_datasheet

  decorates_assigned :item
  decorates_assigned :datasheet
  decorates_assigned :datasheet_lines

  # GET /items/1 or /items/1.json
  def show
  end

  # GET /items/new
  def new
    @datasheet = @item.datasheet.new
    respond_to do |format|
      format.html
      format.js
    end
  end

  # POST /items or /items.json
  def create
    @datasheet = @item.datasheet.new(datasheet_params)

    respond_to do |format|
      if @datasheet.save
        format.html {
          redirect_to admin_datasheet_path(@datasheet),
                      notice: 'Datasheet was successfully created.' }
        format.json { render :show, status: :created, location: @datasheet }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @datasheet.errors, status: :unprocessable_entity }
      end
    end
  end

  def calculate_cmv
    return 0 unless params[:customer_price].present?

    value = params[:customer_price].to_f
    return 0 unless value.positive?

    @cmv = @datasheet.calculate_cmv(value)

    respond_to do |format|
      format.json { render json: { cmv: @cmv.round(2), cmv_class: @datasheet.cmv_class_color(@cmv) } }
    end
  end

  # DELETE /items/1 or /items/1.json
  def destroy
    @datasheet.destroy

    respond_to do |format|
      format.html { redirect_to admin_item_path(@item), notice: 'Item was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private

  def set_item
    @item = if @datasheet.present?
              @datasheet.item
            else
              Item.find_by(id: params[:item_id])
            end
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_datasheet
    @datasheet = if @item.datasheet.present?
                   @item.datasheet
                 else

                   @item.datasheet.create(name: 'New Datasheet')
                 end

    @datasheet_lines = @datasheet.datasheet_lines
  end

  # Only allow a list of trusted parameters through.
  def datasheet_params
    params.require(:datasheet).permit(:name, :item_id, :status)
  end
end
