"""
Firestore database operations for user management and sessions.
"""

from google.cloud import firestore
from google.cloud.firestore_v1.base_query import FieldFilter
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any

from secret_manager import get_secret


class FirestoreDB:
    """Firestore database client wrapper."""
    
    # Collection names
    USERS_COLLECTION = "users"
    SESSIONS_COLLECTION = "sessions"
    AUDIT_LOGS_COLLECTION = "audit_logs"
    DEMOS_COLLECTION = "demos"
    
    def __init__(self, project_id: Optional[str] = None):
        """
        Initialize Firestore client.
        
        Args:
            project_id: GCP project ID (uses Secret Manager if not provided)
        """
        self.project_id = project_id or get_secret("GCP_PROJECT_ID")
        self._client: Optional[firestore.Client] = None
    
    @property
    def client(self) -> firestore.Client:
        """Lazy-load Firestore client."""
        if self._client is None:
            self._client = firestore.Client(project=self.project_id)
        return self._client
    
    # ============================================
    # User Operations
    # ============================================
    
    def get_user_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        """
        Get a user by their ID.
        
        Args:
            user_id: User's unique identifier (e.g., 'admin-automatia')
            
        Returns:
            User document data or None if not found
        """
        doc_ref = self.client.collection(self.USERS_COLLECTION).document(user_id)
        doc = doc_ref.get()
        
        if doc.exists:
            data = doc.to_dict()
            data["id"] = doc.id
            return data
        return None
    
    def create_user(
        self,
        user_id: str,
        name: str,
        password_hash: str,
        access: List[str],
        is_admin: bool = False,
        quick_access: bool = True,
    ) -> Dict[str, Any]:
        """
        Create a new user.
        
        Args:
            user_id: Unique identifier (lowercase, hyphens only)
            name: Display name
            password_hash: Bcrypt hashed password
            access: List of demo IDs user can access
            is_admin: Whether user has admin privileges
            quick_access: Whether to show quick access section
            
        Returns:
            Created user document data
        """
        now = datetime.now(timezone.utc)
        
        user_data = {
            "name": name,
            "password_hash": password_hash,
            "access": access,
            "is_admin": is_admin,
            "quick_access": quick_access,
            "created_at": now,
            "updated_at": now,
            "last_login": None,
            "is_active": True,
        }
        
        doc_ref = self.client.collection(self.USERS_COLLECTION).document(user_id)
        doc_ref.set(user_data)
        
        user_data["id"] = user_id
        return user_data
    
    def update_user(
        self,
        user_id: str,
        updates: Dict[str, Any],
    ) -> Optional[Dict[str, Any]]:
        """
        Update a user's data.
        
        Args:
            user_id: User's unique identifier
            updates: Dictionary of fields to update
            
        Returns:
            Updated user data or None if not found
        """
        doc_ref = self.client.collection(self.USERS_COLLECTION).document(user_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            return None
        
        updates["updated_at"] = datetime.now(timezone.utc)
        doc_ref.update(updates)
        
        return self.get_user_by_id(user_id)
    
    def deactivate_user(self, user_id: str) -> bool:
        """
        Deactivate a user (soft delete).
        User data and activity logs are preserved.
        
        Args:
            user_id: User's unique identifier
            
        Returns:
            True if deactivated, False if not found
        """
        doc_ref = self.client.collection(self.USERS_COLLECTION).document(user_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            return False
        
        doc_ref.update({
            "is_active": False,
            "deactivated_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
        })
        return True
    
    def reactivate_user(self, user_id: str) -> bool:
        """
        Reactivate a deactivated user.
        
        Args:
            user_id: User's unique identifier
            
        Returns:
            True if reactivated, False if not found
        """
        doc_ref = self.client.collection(self.USERS_COLLECTION).document(user_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            return False
        
        doc_ref.update({
            "is_active": True,
            "reactivated_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
        })
        return True
    
    def list_users(self, include_inactive: bool = False) -> List[Dict[str, Any]]:
        """
        List all users.
        
        Args:
            include_inactive: Whether to include inactive users
            
        Returns:
            List of user documents
        """
        collection_ref = self.client.collection(self.USERS_COLLECTION)
        
        if not include_inactive:
            query = collection_ref.where(filter=FieldFilter("is_active", "==", True))
        else:
            query = collection_ref
        
        users = []
        for doc in query.stream():
            data = doc.to_dict()
            data["id"] = doc.id
            # Don't expose password hash in list
            data.pop("password_hash", None)
            users.append(data)
        
        return users
    
    def update_last_login(self, user_id: str) -> None:
        """Update user's last login timestamp."""
        doc_ref = self.client.collection(self.USERS_COLLECTION).document(user_id)
        doc_ref.update({
            "last_login": datetime.now(timezone.utc),
        })
    
    # ============================================
    # Demo Operations
    # ============================================
    
    def get_demo_by_id(self, demo_id: str) -> Optional[Dict[str, Any]]:
        """
        Get a demo by its ID.
        
        Args:
            demo_id: Demo's unique identifier (e.g., 'manhattan-smiles')
            
        Returns:
            Demo document data or None if not found
        """
        doc_ref = self.client.collection(self.DEMOS_COLLECTION).document(demo_id)
        doc = doc_ref.get()
        
        if doc.exists:
            data = doc.to_dict()
            data["id"] = doc.id
            return data
        return None
    
    def create_demo(
        self,
        demo_id: str,
        title: str,
        description: str,
        icon: str,
        industry: str,
        path: str,
        tags: List[str],
        keywords: str = "",
        title_es: str = "",
        description_es: str = "",
        tags_es: Optional[List[str]] = None,
        sort_order: int = 0,
        is_active: bool = True,
        is_external: bool = False,
    ) -> Dict[str, Any]:
        """
        Create a new demo entry.
        
        Args:
            demo_id: Unique identifier (lowercase, hyphens only)
            title: Display title (English)
            description: Description (English)
            icon: Emoji icon for the demo
            industry: Industry category (e.g., "HealthTech", "MedTourism")
            path: Relative path to the demo HTML file, or full URL if is_external=True
            tags: List of feature tags (English)
            keywords: Search keywords for filtering
            title_es: Title in Spanish (optional)
            description_es: Description in Spanish (optional)
            tags_es: Tags in Spanish (optional)
            sort_order: Order for display (lower = first)
            is_active: Whether demo is visible
            is_external: Whether this is an external URL (opens in new tab)
            
        Returns:
            Created demo document data
        """
        now = datetime.now(timezone.utc)
        
        demo_data = {
            "title": title,
            "description": description,
            "icon": icon,
            "industry": industry,
            "path": path,
            "tags": tags,
            "keywords": keywords,
            "title_es": title_es or title,
            "description_es": description_es or description,
            "tags_es": tags_es or tags,
            "sort_order": sort_order,
            "is_active": is_active,
            "is_external": is_external,
            "created_at": now,
            "updated_at": now,
        }
        
        doc_ref = self.client.collection(self.DEMOS_COLLECTION).document(demo_id)
        doc_ref.set(demo_data)
        
        demo_data["id"] = demo_id
        return demo_data
    
    def update_demo(
        self,
        demo_id: str,
        updates: Dict[str, Any],
    ) -> Optional[Dict[str, Any]]:
        """
        Update a demo's data.
        
        Args:
            demo_id: Demo's unique identifier
            updates: Dictionary of fields to update
            
        Returns:
            Updated demo data or None if not found
        """
        doc_ref = self.client.collection(self.DEMOS_COLLECTION).document(demo_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            return None
        
        updates["updated_at"] = datetime.now(timezone.utc)
        doc_ref.update(updates)
        
        return self.get_demo_by_id(demo_id)
    
    def delete_demo(self, demo_id: str) -> bool:
        """
        Soft delete a demo (deactivate it).
        Demo data is preserved for historical records.
        
        Args:
            demo_id: Demo's unique identifier
            
        Returns:
            True if deactivated, False if not found
        """
        doc_ref = self.client.collection(self.DEMOS_COLLECTION).document(demo_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            return False
        
        doc_ref.update({
            "is_active": False,
            "deactivated_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
        })
        return True
    
    def reactivate_demo(self, demo_id: str) -> bool:
        """
        Reactivate a deactivated demo.
        
        Args:
            demo_id: Demo's unique identifier
            
        Returns:
            True if reactivated, False if not found
        """
        doc_ref = self.client.collection(self.DEMOS_COLLECTION).document(demo_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            return False
        
        doc_ref.update({
            "is_active": True,
            "reactivated_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
        })
        return True
    
    def list_demos(self, include_inactive: bool = False) -> List[Dict[str, Any]]:
        """
        List all demos, ordered by sort_order.
        
        Args:
            include_inactive: Whether to include inactive demos
            
        Returns:
            List of demo documents
        """
        collection_ref = self.client.collection(self.DEMOS_COLLECTION)
        
        if not include_inactive:
            query = collection_ref.where(filter=FieldFilter("is_active", "==", True))
        else:
            query = collection_ref
        
        # Order by sort_order, then by title
        query = query.order_by("sort_order").order_by("title")
        
        demos = []
        for doc in query.stream():
            data = doc.to_dict()
            data["id"] = doc.id
            demos.append(data)
        
        return demos
    
    # ============================================
    # Audit Log Operations (System-level)
    # ============================================
    
    def log_action(
        self,
        action: str,
        user_id: Optional[str],
        details: Optional[Dict[str, Any]] = None,
        ip_address: Optional[str] = None,
    ) -> str:
        """
        Log a system action for audit purposes.
        
        Args:
            action: Type of action (e.g., 'login', 'logout', 'access_demo')
            user_id: User who performed the action
            details: Additional details about the action
            ip_address: Client IP address
            
        Returns:
            Created log document ID
        """
        log_data = {
            "action": action,
            "user_id": user_id,
            "details": details or {},
            "ip_address": ip_address,
            "timestamp": datetime.now(timezone.utc),
        }
        
        doc_ref = self.client.collection(self.AUDIT_LOGS_COLLECTION).add(log_data)
        return doc_ref[1].id
    
    # ============================================
    # User Activity Tracking (Per-user collections)
    # ============================================
    
    USER_ACTIVITY_COLLECTION = "user_activity"
    EVENTS_SUBCOLLECTION = "events"
    
    def _get_user_activity_ref(self, user_id: str):
        """Get reference to a user's activity document."""
        return self.client.collection(self.USER_ACTIVITY_COLLECTION).document(user_id)
    
    def _get_user_events_ref(self, user_id: str):
        """Get reference to a user's events subcollection."""
        return self._get_user_activity_ref(user_id).collection(self.EVENTS_SUBCOLLECTION)
    
    def initialize_user_activity(self, user_id: str, name: str) -> None:
        """
        Initialize activity tracking for a new user.
        Creates the user's activity document with metadata.
        Called automatically when a user is created.
        
        Args:
            user_id: User's unique identifier
            name: User's display name
        """
        now = datetime.now(timezone.utc)
        
        user_activity_ref = self._get_user_activity_ref(user_id)
        user_activity_ref.set({
            "user_id": user_id,
            "name": name,
            "created_at": now,
            "last_activity": now,
            "total_events": 0,
            "total_sessions": 0,
            "total_time_seconds": 0,
            "demos_visited": [],
            "is_tracking_active": True,
        })
    
    def log_user_activity(
        self,
        user_id: str,
        event_type: str,
        event_data: Optional[Dict[str, Any]] = None,
        page_url: Optional[str] = None,
        demo_id: Optional[str] = None,
        session_id: Optional[str] = None,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
    ) -> str:
        """
        Log a user activity event to their personal activity collection.
        
        Args:
            user_id: User's unique identifier
            event_type: Type of event (see EVENT_TYPES below)
            event_data: Additional event-specific data
            page_url: URL where event occurred
            demo_id: Demo page identifier (if applicable)
            session_id: Client-generated session ID
            ip_address: Client IP address
            user_agent: Browser user agent string
            
        Returns:
            Created event document ID
            
        Event Types:
            - session_start: User started a new session
            - session_end: User ended session (includes duration)
            - page_view: User viewed a page
            - page_exit: User left a page (includes time_on_page)
            - button_click: User clicked a button
            - link_click: User clicked a link
            - chat_opened: User opened chat widget
            - chat_closed: User closed chat widget
            - chat_message_sent: User sent a chat message
            - chat_message_received: Bot responded to user
            - form_interaction: User interacted with a form
            - scroll_depth: User scrolled to a certain depth
            - demo_launched: User launched a demo
            - error: An error occurred
            - custom: Custom event type
        """
        now = datetime.now(timezone.utc)
        
        event_doc = {
            "event_type": event_type,
            "timestamp": now,
            "session_id": session_id,
            "page_url": page_url,
            "demo_id": demo_id,
            "data": event_data or {},
            "ip_address": ip_address,
            "user_agent": user_agent,
        }
        
        # Add event to user's events subcollection
        events_ref = self._get_user_events_ref(user_id)
        doc_ref = events_ref.add(event_doc)
        event_id = doc_ref[1].id
        
        # Update user's activity metadata
        user_activity_ref = self._get_user_activity_ref(user_id)
        
        # Build update data
        update_data = {
            "last_activity": now,
            "total_events": firestore.Increment(1),
        }
        
        # Track session starts
        if event_type == "session_start":
            update_data["total_sessions"] = firestore.Increment(1)
        
        # Track time spent (from page_exit or session_end events)
        if event_type in ["page_exit", "session_end"]:
            duration = (event_data or {}).get("duration_seconds", 0)
            if duration > 0:
                update_data["total_time_seconds"] = firestore.Increment(duration)
        
        # Track demos visited
        if demo_id and event_type == "page_view":
            update_data["demos_visited"] = firestore.ArrayUnion([demo_id])
        
        try:
            user_activity_ref.update(update_data)
        except Exception:
            # If user activity doc doesn't exist, create it
            user = self.get_user_by_id(user_id)
            if user:
                self.initialize_user_activity(user_id, user.get("name", user_id))
                user_activity_ref.update(update_data)
        
        return event_id
    
    def get_user_activity_summary(self, user_id: str) -> Optional[Dict[str, Any]]:
        """
        Get a user's activity summary/metadata.
        
        Args:
            user_id: User's unique identifier
            
        Returns:
            User activity metadata or None if not found
        """
        doc = self._get_user_activity_ref(user_id).get()
        if doc.exists:
            return doc.to_dict()
        return None
    
    def get_user_events(
        self,
        user_id: str,
        limit: int = 100,
        event_type: Optional[str] = None,
        demo_id: Optional[str] = None,
        session_id: Optional[str] = None,
        start_time: Optional[datetime] = None,
        end_time: Optional[datetime] = None,
    ) -> List[Dict[str, Any]]:
        """
        Get a user's activity events with optional filtering.
        
        Args:
            user_id: User's unique identifier
            limit: Maximum number of events to return
            event_type: Filter by event type
            demo_id: Filter by demo ID
            session_id: Filter by session ID
            start_time: Filter events after this time
            end_time: Filter events before this time
            
        Returns:
            List of event documents
        """
        query = self._get_user_events_ref(user_id)
        
        # Apply filters
        if event_type:
            query = query.where(filter=FieldFilter("event_type", "==", event_type))
        if demo_id:
            query = query.where(filter=FieldFilter("demo_id", "==", demo_id))
        if session_id:
            query = query.where(filter=FieldFilter("session_id", "==", session_id))
        if start_time:
            query = query.where(filter=FieldFilter("timestamp", ">=", start_time))
        if end_time:
            query = query.where(filter=FieldFilter("timestamp", "<=", end_time))
        
        # Order by timestamp descending and limit
        query = query.order_by("timestamp", direction=firestore.Query.DESCENDING).limit(limit)
        
        events = []
        for doc in query.stream():
            event = doc.to_dict()
            event["id"] = doc.id
            events.append(event)
        
        return events
    
    def get_user_sessions(self, user_id: str, limit: int = 50) -> List[Dict[str, Any]]:
        """
        Get a user's sessions with aggregated data.
        
        Args:
            user_id: User's unique identifier
            limit: Maximum number of sessions to return
            
        Returns:
            List of session summaries
        """
        # Get session_start events
        events_ref = self._get_user_events_ref(user_id)
        query = events_ref.where(
            filter=FieldFilter("event_type", "==", "session_start")
        ).order_by("timestamp", direction=firestore.Query.DESCENDING).limit(limit)
        
        sessions = []
        for doc in query.stream():
            session = doc.to_dict()
            session["id"] = doc.id
            sessions.append(session)
        
        return sessions
    
    def pause_user_activity_tracking(self, user_id: str) -> bool:
        """
        Pause activity tracking for a user (when deactivated).
        Activity data is preserved, just stops new events.
        
        Args:
            user_id: User's unique identifier
            
        Returns:
            True if updated successfully
        """
        try:
            self._get_user_activity_ref(user_id).update({
                "is_tracking_active": False,
                "tracking_paused_at": datetime.now(timezone.utc),
            })
            return True
        except Exception:
            return False
    
    def resume_user_activity_tracking(self, user_id: str) -> bool:
        """
        Resume activity tracking for a user (when reactivated).
        
        Args:
            user_id: User's unique identifier
            
        Returns:
            True if updated successfully
        """
        try:
            self._get_user_activity_ref(user_id).update({
                "is_tracking_active": True,
                "tracking_resumed_at": datetime.now(timezone.utc),
            })
            return True
        except Exception:
            return False


# Singleton instance
_db_instance: Optional[FirestoreDB] = None


def get_db() -> FirestoreDB:
    """Get the singleton Firestore database instance."""
    global _db_instance
    if _db_instance is None:
        _db_instance = FirestoreDB()
    return _db_instance
