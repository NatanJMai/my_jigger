class Admin::DatasheetLinesController < AdminController
  before_action :set_datasheet_line, only: [:show, :edit, :update, :destroy]
  before_action :set_datasheet

  def index
    @datasheet_lines = @datasheet.datasheet_lines
  end

  # GET /items/1 or /items/1.json
  def show
  end

  def new_line
    @datasheet_line = @datasheet.datasheet_lines.new
    respond_to do |format|
      format.turbo_stream {}
    end
  end

  # GET /items/new
  def post_something
    @datasheet_line = @datasheet.datasheet_lines.new


  end

  # GET /items/1/edit
  def edit
    @datasheet = @datasheet_line.datasheet
  end

  # POST /items or /items.json
  def create
    @datasheet_line = @datasheet.datasheet_lines.new(datasheet_line_params)

    respond_to do |format|
      if @datasheet_line.save
        format.html { redirect_to admin_datasheet_path(@datasheet),
                                  notice: "Datasheet was successfully created." }
        format.json { render :show, status: :created, location: @datasheet }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @datasheet_line.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /items/1 or /items/1.json
  def update
    respond_to do |format|
      if @datasheet_line.update (datasheet_line_params)
        format.html { redirect_to admin_datasheet_path(@datasheet),
                                  notice: "Datasheet was successfully updated." }

        format.json { render :show, status: :ok, location: @datasheet_line }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @datasheet_line.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /items/1 or /items/1.json
  def destroy
    @datasheet = @datasheet_line.datasheet
    @datasheet_line.destroy

    respond_to do |format|
      format.html { redirect_to admin_datasheet_path(@datasheet),
                                notice: "Item was successfully destroyed." }

      format.json { head :no_content }
    end
  end

  private

  def set_datasheet
    if @datasheet.present?
      @datasheet = @datasheet_line.datasheet
    else
      @datasheet = Datasheet.find_by(id: params[:datasheet_id])
    end
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_datasheet_line
    @datasheet_line = DatasheetLine.find_by(id: params[:id])
  end

  # Only allow a list of trusted parameters through.
  def datasheet_line_params
    params.require(:datasheet_line).permit(:datasheet_id, :product_id, :unit, :quantity)
  end
end
