# Requirements Document

## Introduction

The EverGain workout logger screen has several usability and functionality issues that prevent users from effectively tracking their workouts. Users cannot see confirmation when logging sets, previous set data is hardcoded and not functional, several buttons don't work, and session end data doesn't reflect actual workout progress. These issues significantly impact the user experience and make the app unusable for its core purpose of workout tracking.

## Glossary

- **Logger Screen**: The main workout tracking interface where users log exercises, sets, reps, and weight
- **Set**: A single group of repetitions of an exercise (e.g., 10 reps of bench press at 60kg)
- **Workout Set**: A database record containing exercise name, weight, reps, RPE, and timestamp
- **Active Session**: The current ongoing workout session that tracks all sets performed
- **Rest Timer**: A countdown timer that helps users track rest periods between sets
- **RPE**: Rate of Perceived Exertion, a scale from 1-10 indicating how difficult a set felt
- **Previous Set**: The last set logged for the current exercise, used as reference for the next set
- **Session Summary**: Statistics shown when ending a workout (duration, total sets, total volume)

## Requirements

### Requirement 1

**User Story:** As a user, I want to see clear visual feedback when I log a set, so that I know my action was successful and the data was saved.

#### Acceptance Criteria

1. WHEN a user clicks the "Log Set" button with valid data, THEN the system SHALL display a success toast notification showing the logged set details
2. WHEN a set is successfully logged, THEN the system SHALL automatically start the rest timer
3. WHEN the rest timer starts, THEN the system SHALL show a visual indicator that rest mode is active
4. WHEN a set is logged, THEN the system SHALL increment the set counter for the next set
5. WHEN a set is logged, THEN the system SHALL clear the weight and reps inputs while keeping RPE

### Requirement 2

**User Story:** As a user, I want to see my previous set data for the current exercise, so that I can track my progress and know what weight/reps to aim for.

#### Acceptance Criteria

1. WHEN a user selects an exercise, THEN the system SHALL load and display the most recent set data for that exercise from the current session
2. WHEN no previous set exists for the current exercise in this session, THEN the system SHALL display "No previous set" or hide the previous set indicator
3. WHEN previous set data is displayed, THEN the system SHALL show weight, reps, and RPE in the format "60kg x 8 @ RPE 7"
4. WHEN a user logs a new set, THEN the system SHALL update the previous set display to show the newly logged set
5. WHEN a user switches exercises, THEN the system SHALL update the previous set display to match the newly selected exercise

### Requirement 3

**User Story:** As a user, I want the "Repeat Set" button to work, so that I can quickly log the same weight and reps as my previous set.

#### Acceptance Criteria

1. WHEN a user clicks the "Repeat Set" button, THEN the system SHALL populate the weight and reps inputs with values from the previous set
2. WHEN no previous set exists, THEN the system SHALL disable the "Repeat Set" button or show a message
3. WHEN the "Repeat Set" button is clicked, THEN the system SHALL also populate the RPE field if available
4. WHEN inputs are populated from repeat set, THEN the system SHALL focus on the log button for quick submission
5. WHEN a user modifies the repeated values, THEN the system SHALL allow logging with the modified values

### Requirement 4

**User Story:** As a user, I want to add notes to my sets, so that I can record form cues, how I felt, or other important information.

#### Acceptance Criteria

1. WHEN a user clicks the "Add Note" button, THEN the system SHALL open a modal with a text input field
2. WHEN a user enters a note and confirms, THEN the system SHALL attach the note to the next logged set
3. WHEN a note is added, THEN the system SHALL show a visual indicator that a note is pending
4. WHEN a set with a note is logged, THEN the system SHALL save the note with the set data
5. WHEN a note modal is cancelled, THEN the system SHALL discard the note without saving

### Requirement 5

**User Story:** As a user, I want to see accurate session statistics when I end my workout, so that I can track my actual workout performance.

#### Acceptance Criteria

1. WHEN a user ends a session, THEN the system SHALL calculate total sets from all logged workout sets
2. WHEN a user ends a session, THEN the system SHALL calculate total volume as the sum of (weight × reps) for all sets
3. WHEN a user ends a session, THEN the system SHALL calculate duration from session start time to end time
4. WHEN session statistics are displayed, THEN the system SHALL show the number of unique exercises performed
5. WHEN session statistics are displayed, THEN the system SHALL format duration in hours and minutes (e.g., "1h 23m")

### Requirement 6

**User Story:** As a developer, I want to implement a workout sets API endpoint, so that the frontend can save and retrieve workout set data.

#### Acceptance Criteria

1. WHEN the backend receives a POST request to log a workout set, THEN the system SHALL save the set with session_id, exercise_name, weight, reps, RPE, notes, and timestamp
2. WHEN the backend receives a GET request for workout sets by session, THEN the system SHALL return all sets for that session ordered by timestamp
3. WHEN the backend receives a GET request for the last set of an exercise in a session, THEN the system SHALL return the most recent set for that exercise
4. WHEN a workout set is saved, THEN the system SHALL update the session's total_sets and total_volume fields
5. WHEN workout sets are retrieved, THEN the system SHALL include all fields including exercise_name, weight, reps, RPE, notes, and timestamp

### Requirement 7

**User Story:** As a user, I want the set counter to accurately reflect the number of sets I've logged for the current exercise, so that I know which set I'm on.

#### Acceptance Criteria

1. WHEN a user selects an exercise, THEN the system SHALL count the number of sets logged for that exercise in the current session
2. WHEN displaying the set counter, THEN the system SHALL show "Set X" where X is the count + 1
3. WHEN a user switches exercises, THEN the system SHALL update the set counter to reflect the new exercise
4. WHEN a user logs a set, THEN the system SHALL increment the set counter immediately
5. WHEN no sets have been logged for an exercise, THEN the system SHALL display "Set 1"

### Requirement 8

**User Story:** As a user, I want visual feedback during rest periods, so that I know when to start my next set.

#### Acceptance Criteria

1. WHEN the rest timer is active, THEN the system SHALL display a prominent countdown timer
2. WHEN the rest timer reaches zero, THEN the system SHALL play a notification sound or vibration
3. WHEN the rest timer reaches zero, THEN the system SHALL show a visual alert that rest is complete
4. WHEN a user wants to skip rest, THEN the system SHALL provide a button to stop the timer early
5. WHEN rest is complete, THEN the system SHALL automatically focus on the weight input for the next set

### Requirement 9

**User Story:** As a user, I want to see a workout history for the current session, so that I can review what I've done during my workout.

#### Acceptance Criteria

1. WHEN a session is active, THEN the system SHALL display a collapsible section showing all logged sets
2. WHEN displaying workout history, THEN the system SHALL group sets by exercise
3. WHEN displaying each set, THEN the system SHALL show set number, weight, reps, RPE, and timestamp
4. WHEN a user taps on a logged set, THEN the system SHALL allow editing or deleting that set
5. WHEN the workout history is empty, THEN the system SHALL show an encouraging message to start logging sets
