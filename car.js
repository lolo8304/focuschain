contract Car {
    
    enum LifeStates {
        Ordered,
        Produced,
        Supplied,
        Delivered,
        Dumped
    }
    enum DamageStates {
        None,
        SmallIncidentReported,
        AccidentReported,
        DamageAssessed,
        RepairConfirmed,
        Repaired
    }
    
    // This is the current life stage of the car
    LifeStates public state = LifeStates.Ordered;
    
    // This is the current damage stage of the car
    DamageStates public damageState = DamageStates.None;
    
    uint public creationTime = now;
    address public producer;
    address public owner;
    address public holder;
    
    string public model;
    uint8 public price;
    uint8 public ccm;
    string public details;
    string public chassisNo;
    string public assemblyLine;
    
    string public insuranceId;
    string public policyNo;
    bool public matriculated = false;

    
    //Event Definitions
    event Ordered (
        address _producer,
        address _owner,
        string _modell,
        uint8 _ccm,
        uint8 _price
        );
    
    event Produced (
        address _producer,
        address _owner,
        string chassisNo
        );
        
    event Supplied (
        address _garage
        );
    
    event Delivered (
        address _owner
        );
        
    event Matriculated (
        address _owner,
        string _insuranceId,
        string _policyNo
        );
        
    event Exmatriculated (
        address _owner,
        string _policyNo
        );
        
    event Sold (
        address _oldOwner,
        address _newOwner
        );

    modifier atState(LifeStates _state) {
        if (state != _state) throw;
        _
    }
    modifier checkOwner() {
        if (owner != msg.sender) throw;
        _
    }
    
    modifier atSupplied() {
        if (uint(state) < 2) throw; //mindestns Supplied
        _
    }
    modifier atDamage(DamageStates _state) {
        if (damageState != _state) throw;
        _
    }
    function nextState() internal {
        state = LifeStates(uint(state) + 1);
    }
    

    //executed as Garage
    function Car (string _model, uint8 _ccm, uint8 _price, string _details, address _producer, address _owner) {
        model = _model;
        ccm = _ccm;
        price = _price;
        details = _details;
        producer = _producer;
        owner = _owner;
        holder = msg.sender; //virtueller Holder ist Garage
        
        //Trigger Ordered Event
        Ordered (producer, owner, model, ccm, price);
    
    }

    //exectued as assepbly line
    function produce(string _chassisNo, string _assemblyLine)
    {
        chassisNo = _chassisNo;
        assemblyLine = _assemblyLine;
		holder = msg.sender;
        
        state = LifeStates.Produced;
        
        //Trigger Event Produced
        Produced(producer, owner, chassisNo);
    } 
    
    //executed as Garage
    function supply() 
    {
	    holder = msg.sender;
	
	    state = LifeStates.Supplied;
	    //Trigger Supplied Event
	    Supplied(msg.sender);
    } 

    //executed as StVa
    function matriculate(string _insuranceId, string _policyNo) 
        atSupplied
    {
		insuranceId = _insuranceId;
        policyNo = _policyNo;
        matriculated = true;
        
        //Trigger Event
        Matriculated(owner, insuranceId, policyNo);
    } 
    
    function exmatriculate(string _policyNo) 
        atSupplied
    {
        policyNo = "";
        matriculated = false;
        
        //Trigger Event
        Exmatriculated(owner, policyNo);
    } 
    
    // executed as the owner (customer)
    function deliver() 
        checkOwner
        atSupplied
    {
		state = LifeStates.Delivered;
		owner = msg.sender;
		holder = msg.sender;
		
		//Trigger Event
		Delivered(owner);
    } 
	
	// executed as the owner
	function sell(address _owner)
		checkOwner
		atSupplied
	{
		var oldOwner = owner;
		owner = _owner;
		holder = _owner;
		
		//Triffer Event
		Sold(oldOwner, owner);
	}		
    
	
    function getState() returns (LifeStates)
    {
        return state;
    } 
    
    function () {
        // This function gets executed if a
        // transaction with invalid data is sent to
        // the contract or just ether without data.
        // We revert the send so that no-one
        // accidentally loses money when using the
        // contract.
        throw;
    }
   
}